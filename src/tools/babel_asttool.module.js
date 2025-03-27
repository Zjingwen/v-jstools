import generator from "@babel/generator";
import parser from "@babel/parser";
import template from "@babel/template";
import traverse from "@babel/traverse";
import t from "@babel/types";

export const Babel = {
  parse: parser,
  generate: generator,
  traverse: traverse,
  template: template,
  t: t,
};

export function transform_jscode_to_es5(jscode, config) {
  function test() {
    return {
      visitor: {
        Identifier(path) {
          path.node.name = "LOL";
        },
      },
    };
  }
  config = config || {};
  var presets = config.presets || ["react", "env"];
  return Babel.transform(jscode, {
    presets: presets,
    // plugins: [test, test],
  }).code;
}

export function FormatMember(path) {
  // _0x19882c['removeCookie']['toString']()
  //  |
  //  |
  //  |
  //  v
  // _0x19882c.removeCookie.toString()
  var curNode = path.node;
  if (!t.isStringLiteral(curNode.property)) return;
  if (curNode.computed === undefined || !curNode.computed === true) return;
  if (!/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(curNode.property.value)) return;
  curNode.property = t.identifier(curNode.property.value);
  curNode.computed = false;
}

export function TransCondition(path) {
  // a = m?11:22;
  //  |
  //  |
  //  |
  //  v
  // m ? a = 11 : a = 22;
  let { test, consequent, alternate } = path.node;
  const ParentPath = path.parentPath;
  if (ParentPath.isAssignmentExpression()) {
    let { operator, left } = ParentPath.node;
    if (operator === "=") {
      consequent = t.AssignmentExpression("=", left, consequent);
      alternate = t.AssignmentExpression("=", left, alternate);
      ParentPath.replaceWith(
        t.conditionalExpression(test, consequent, alternate)
      );
    }
  }
}
export function ConditionToIf(path) {
  // m ? a = 11 : a = 22;
  //  |
  //  |
  //  |
  //  v
  // if (m) {
  //   a = 11;
  // } else {
  //   a = 22;
  // }
  let { expression } = path.node;
  if (!t.isConditionalExpression(expression)) return;
  let { test, consequent, alternate } = expression;
  path.replaceWith(
    t.ifStatement(
      test,
      t.blockStatement([t.expressionStatement(consequent)]),
      t.blockStatement([t.expressionStatement(alternate)])
    )
  );
}

export function ConditionVarToIf(path) {
  // var m ? a = 11 : a = 22;
  //  |
  //  |
  //  |
  //  v
  // var a;
  // if (m) {
  //   a = 11;
  // } else {
  //   a = 22;
  // }
  // let 和 const 的作用域为块，所以不能直接把定义用的 kind 放在 if 的子块里面
  if (t.isForStatement(path.parentPath)) return;
  if (path.node.kind == "const") return;
  var decl = path.node.declarations;
  var rpls = [];
  var togg = false;
  for (var i = 0; i < decl.length; i++) {
    if (t.isConditionalExpression(decl[i].init)) {
      togg = true;
      let { test, consequent, alternate } = decl[i].init;
      rpls.push(
        t.variableDeclaration(path.node.kind, [
          t.variableDeclarator(decl[i].id),
        ])
      );
      rpls.push(
        t.ifStatement(
          test,
          t.blockStatement([
            t.ExpressionStatement(
              t.AssignmentExpression("=", decl[i].id, consequent)
            ),
          ]),
          t.blockStatement([
            t.ExpressionStatement(
              t.AssignmentExpression("=", decl[i].id, alternate)
            ),
          ])
        )
      );
    } else {
      rpls.push(t.VariableDeclaration(path.node.kind, [decl[i]]));
    }
  }
  if (togg) {
    path.replaceWithMultiple(rpls);
    path.stop();
  }
}

export function RemoveComma(path) {
  // a = 1, b = ddd(), c = null;
  //  |
  //  |
  //  |
  //  v
  // a = 1;
  // b = ddd();
  // c = null;
  let { expression } = path.node;
  if (!t.isSequenceExpression(expression)) return;
  let body = [];
  expression.expressions.forEach((express) => {
    body.push(t.expressionStatement(express));
  });
  path.replaceInline(body);
}

export function RemoveVarComma(path) {
  // var a = 1, b = ddd(), c = null;
  //   |
  //   |
  //   |
  //   v
  // var a = 1;
  // var b = ddd();
  // var c = null;
  let { kind, declarations } = path.node;
  if (declarations.length < 2) return;
  if (t.isForStatement(path.parentPath)) return;
  temp = [];
  declarations.forEach((VariableDeclarator) => {
    temp.push(t.variableDeclaration(kind, [VariableDeclarator]));
  });
  path.replaceInline(temp);
}

export function MergeObj(path) {
  // var _0xb28de8 = {};
  // _0xb28de8["abcd"] = function(_0x22293f, _0x5a165e) {
  //     return _0x22293f == _0x5a165e;
  // };
  // _0xb28de8.dbca = function(_0xfbac1e, _0x23462f, _0x556555) {
  //     return _0xfbac1e(_0x23462f, _0x556555);
  // };
  // _0xb28de8.aaa = function(_0x57e640) {
  //     return _0x57e640();
  // };
  // _0xb28de8["bbb"] = "eee";
  // var _0x15e145 = _0xb28de8;
  //  |
  //  |
  //  |
  //  v
  // var _0xb28de8 = {
  //   "abcd": function (_0x22293f, _0x5a165e) {
  //     return _0x22293f == _0x5a165e;
  //   },
  //   "dbca": function (_0xfbac1e, _0x23462f, _0x556555) {
  //     return _0xfbac1e(_0x23462f, _0x556555);
  //   },
  //   "aaa": function (_0x57e640) {
  //     return _0x57e640();
  //   },
  //   "bbb": "eee"
  // };
  const { id, init } = path.node;
  if (!t.isObjectExpression(init))
    // 判断是否是定义对象
    return;
  let name = id.name;
  let properties = init.properties;
  let scope = path.scope;
  let binding = scope.getBinding(name);
  if (!binding || binding.constantViolations.length > 0) {
    // 确认该对象没有被多次定义
    return;
  }
  let paths = binding.referencePaths;
  scope.traverse(scope.block, {
    AssignmentExpression: function (_path) {
      const left = _path.get("left");
      const right = _path.get("right");
      if (!left.isMemberExpression()) return;
      const object = left.get("object");
      const property = left.get("property");
      function _pas_path(_path, left) {
        if (
          _path.parentPath.node.type == "VariableDeclarator" ||
          _path.parentPath.node.type == "AssignmentExpression"
        ) {
          _path.replaceWith(left);
        } else {
          _path.remove();
        }
      }
      if (
        object.isIdentifier({ name: name }) &&
        property.isStringLiteral() &&
        _path.scope == scope
      ) {
        properties.push(
          t.ObjectProperty(t.valueToNode(property.node.value), right.node)
        );
        _pas_path(_path, left);
      }
      if (
        object.isIdentifier({ name: name }) &&
        property.isIdentifier() &&
        _path.scope == scope
      ) {
        properties.push(
          t.ObjectProperty(t.valueToNode(property.node.name), right.node)
        );
        _pas_path(_path, left);
      }
    },
  });
  paths.map(function (refer_path) {
    try {
      let bindpath = refer_path.parentPath;
      if (!t.isVariableDeclarator(bindpath.node)) return;
      let bindname = bindpath.node.id.name;
      bindpath.scope.rename(bindname, name, bindpath.scope.block);
      bindpath.remove();
    } catch (e) {}
  });
}

export function CallToStr(path) {
  // var _0xb28de8 = {
  //     "abcd": function(_0x22293f, _0x5a165e) {
  //         return _0x22293f == _0x5a165e;
  //     },
  //     "dbca": function(_0xfbac1e, _0x23462f, _0x556555) {
  //         return _0xfbac1e(_0x23462f, _0x556555);
  //     },
  //     "aaa": function(_0x57e640) {
  //         return _0x57e640();
  //     },
  //     "bbb": "eee"
  // };
  // var aa = _0xb28de8["abcd"](123, 456);
  // var bb = _0xb28de8["dbca"](bcd, 11, 22);
  // var cc = _0xb28de8["aaa"](dcb);
  // var dd = _0xb28de8["bbb"];
  //   |
  //   |
  //   |
  //   v
  // var aa = 123 == 456;
  // var bb = bcd(11, 22);
  // var cc = dcb();
  // var dd = "eee";
  var node = path.node;
  if (!t.isObjectExpression(node.init))
    // 判断是否使用对象
    return;
  var objPropertiesList = node.init.properties;
  if (objPropertiesList.length == 0) return;
  var objName = node.id.name;
  // 是否可删除该对象：发生替换时可删除，否则不删除
  var del_flag = false;
  var objkeys = {};
  var objlist = objPropertiesList.map(function (prop) {
    var key = prop.key.value;
    if (t.isFunctionExpression(prop.value)) {
      var retStmt = prop.value.body.body[0];
      if (typeof retStmt == "undefined") return;
      if (t.isBinaryExpression(retStmt.argument)) {
        var repfunc = function (_path, args) {
          if (args.length == 2) {
            _path.replaceWith(
              t.binaryExpression(retStmt.argument.operator, args[0], args[1])
            );
          }
        };
      } else if (t.isLogicalExpression(retStmt.argument)) {
        var repfunc = function (_path, args) {
          if (args.length == 2) {
            _path.replaceWith(
              t.logicalExpression(retStmt.argument.operator, args[0], args[1])
            );
          }
        };
      } else if (
        t.isCallExpression(retStmt.argument) &&
        t.isIdentifier(retStmt.argument.callee)
      ) {
        var repfunc = function (_path, args) {
          _path.replaceWith(t.callExpression(args[0], args.slice(1)));
        };
      }
      objkeys[key] = repfunc;
    } else if (t.isStringLiteral(prop.value)) {
      var retStmt = prop.value.value;
      objkeys[key] = function (_path) {
        _path.replaceWith(t.stringLiteral(retStmt));
      };
    }
  });
  var fnPath = path.getFunctionParent() || path.scope.path;
  fnPath.traverse({
    CallExpression: function (_path) {
      var _node = _path.node.callee;
      if (!t.isMemberExpression(_path.node.callee)) return;
      if (!t.isIdentifier(_node.object) || _node.object.name !== objName)
        return;
      if (
        !(t.isStringLiteral(_node.property) || t.isIdentifier(_node.property))
      )
        return;
      if (!(objkeys[_node.property.value] || objkeys[_node.property.name]))
        return;
      var args = _path.node.arguments;
      var func = objkeys[_node.property.value] || objkeys[_node.property.name];
      func(_path, args);
      del_flag = true;
    },
    MemberExpression: function (_path) {
      var _node = _path.node;
      if (!t.isIdentifier(_node.object) || _node.object.name !== objName)
        return;
      if (
        !(t.isStringLiteral(_node.property) || t.isIdentifier(_node.property))
      )
        return;
      if (!(objkeys[_node.property.value] || objkeys[_node.property.name]))
        return;
      var func = objkeys[_node.property.value] || objkeys[_node.property.name];
      func(_path);
      del_flag = true;
    },
  });

  if (del_flag) {
    // 如果发生替换，则删除该对象, 该处可能出问题，因为字典的内容未必会饱和使用
    path.remove();
  }
}

export function delExtra(path) {
  // ['\x49\x63\x4b\x72\x77\x70\x2f\x44\x6c\x67\x3d\x3d',0x123];
  //   |
  //   |
  //   |
  //   v
  // ["IcKrwp/Dlg==", 291];
  delete path.node.extra;
}

export function ClearDeadCode(path) {
  function clear(path, toggle) {
    if (toggle) {
      if (path.node.consequent.type == "BlockStatement") {
        path.replaceWithMultiple(path.node.consequent.body);
      } else {
        path.replaceWith(path.node.consequent);
      }
    } else {
      if (path.node.alternate) {
        if (path.node.alternate.type == "BlockStatement") {
          path.replaceWithMultiple(path.node.alternate.body);
        } else {
          path.replaceWith(path.node.alternate);
        }
      } else {
        path.remove();
      }
    }
  }
  var temps = ["StringLiteral", "NumericLiteral", "BooleanLiteral"];
  if (path.node.test.type === "BinaryExpression") {
    if (
      temps.indexOf(path.node.test.left.type) !== -1 &&
      temps.indexOf(path.node.test.right.type) !== -1
    ) {
      var left = JSON.stringify(path.node.test.left.value);
      var right = JSON.stringify(path.node.test.right.value);
      clear(path, eval(left + path.node.test.operator + right));
    }
  } else if (temps.indexOf(path.node.test.type) !== -1) {
    clear(path, eval(JSON.stringify(path.node.test.value)));
  }
}

export function And2If(path) {
  if (path.node.expression.type === "LogicalExpression") {
    var left = path.node.expression.left;
    var right = path.node.expression.right;
    if (path.node.expression.operator == "&&") {
      path.replaceWith(
        t.IfStatement(left, t.BlockStatement([t.ExpressionStatement(right)]))
      );
    }
  }
}

export function calcBinary(path) {
  var tps = ["StringLiteral", "BooleanLiteral", "NumericLiteral"];
  var nod = path.node;
  function judge(e) {
    return (
      tps.indexOf(e.type) != -1 ||
      (e.type == "UnaryExpression" && tps.indexOf(e.argument.type) != -1)
    );
  }
  function make_rep(e) {
    if (typeof e == "number") {
      return t.NumericLiteral(e);
    }
    if (typeof e == "string") {
      return t.StringLiteral(e);
    }
    if (typeof e == "boolean") {
      return t.BooleanLiteral(e);
    }
    throw Error("unknown type" + typeof e);
  }
  if (judge(nod.left) && judge(nod.right)) {
    path.replaceWith(make_rep(eval(path + "")));
  }
}

export function clearNotuseFunc(path) {
  if (!path.getFunctionParent()) {
    return;
  }
  var id = path.node.id;
  function is_used(path, name) {
    var binding = path.scope.getBinding(name);
    if (!binding || binding.constantViolations.length > 0) {
      return;
    }
    if (binding.referencePaths.length === 0) {
      return true;
    }
  }
  if (is_used(path, id.name)) {
    path.remove();
  }
}

export function clearNotuseVar(path) {
  if (!path.getFunctionParent()) {
    return;
  }
  var _new_var = [];
  function is_used(path, name) {
    var binding = path.scope.getBinding(name);
    if (!binding || binding.constantViolations.length > 0) {
      return;
    }
    if (binding.referencePaths.length === 0) {
      return true;
    }
  }
  for (var i = 0; i < path.node.declarations.length; i++) {
    var inode = path.node.declarations[i];
    if (t.isIdentifier(inode.id) && is_used(path, inode.id.name)) {
    } else {
      _new_var.push(inode);
    }
  }
  if (_new_var.length) {
    path.node.declarations = _new_var;
  } else {
    path.remove();
  }
}

export function AddCatchLog(path) {
  var err_name = path.node.param.name;
  path.node.body.body.unshift({
    type: "ExpressionStatement",
    expression: {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        computed: false,
        object: {
          type: "Identifier",
          name: "console",
        },
        property: {
          type: "Identifier",
          name: "log",
        },
      },
      arguments: [
        {
          type: "Identifier",
          name: err_name,
        },
      ],
    },
  });
}
