import { Divider, Space, Button, Form, useFormApi, Row, Col, withFormApi, TreeSelect } from '@douyinfe/semi-ui';
import { chromeStorageGet, chromeStorageSet, isEmptyObject } from "@utils";
import { getsets_0, getsets_1, funcs_0, funcs_1 } from '@src/constant/webapi.js';
import config1 from "@src/constant/config1.js";
import config2 from "@src/constant/config2.js";

const { Checkbox, Input } = Form;
function TimeFreezeNumber(props) {
  const { field, value } = props;
  const formApi = useFormApi();
  const click = () => {
    formApi.setValue(field, +new Date());
  };
  return <>
    <Input noLabel field={field} disabled />
    <Button onClick={click}>{value}</Button>
  </>
}

function CookieMatch(props) {
  const { field, value } = props;
  return <>
    <Input field={field} noLabel />{value}
  </>
}

// 单个checkbox
function CheckboxCompones(props) {
  const { field, value } = props;
  return <Checkbox field={field} noLabel>{value}</Checkbox>
}

// 多个checkbox
function CheckboxsCompones(props) {
  const { configs } = props;
  return configs.map(([key, value]) => {
    return <CheckboxCompones field={key} value={value} />
  })
}



const TreeSelectData = withFormApi(function (props) {
  const { title, data } = props;
  const treeElementData = data.map(function (i) {
    let [value, lable] = i;
    let b = {};
    b.label = lable;
    b.value = value;
    b.key = value;
    return b;
  });

  function handleSelect(selectedKey, selected) {
    props.formApi.setValue(selectedKey, selected);
  }

  return <TreeSelect
    onSelect={handleSelect}
    searchPosition="trigger"
    style={{ width: "100%" }}
    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
    treeData={treeElementData}
    multiple
    filterTreeNode
    placeholder={title}
  />
});

export default () => {
  async function handleFormApi(formApi) {
    let b = {};
    for (let [key] of [...config1, ...config2, ...getsets_0, ...getsets_1, ...funcs_0, ...funcs_1]) {
      const res = await chromeStorageGet(key);
      !isEmptyObject(res) && (b[key] = res[key]);
    };
    formApi.setValues(b);
  };

  async function handleChange(value) {
    console.group("handleChange");
    console.log(JSON.stringify(value));
    console.groupEnd();
    for (const key in value) await chromeStorageSet(key, value[key]);
  }

  return <Form style={{ width: '100%' }} onValueChange={handleChange} getFormApi={handleFormApi}>
    <Row gutter={20}>
      <Col span={12}>
        <Divider margin='12px' align='left'>基础配置</Divider>
        <Space vertical wrap align='start'>
          <CheckboxsCompones configs={config1} />
          <TimeFreezeNumber field={config2[0][0]} value={config2[0][1]} />
          <CheckboxCompones field={config2[1][0]} value={config2[1][1]} />
          <CheckboxCompones field={config2[2][0]} value={config2[2][1]} />
          <CheckboxCompones field={config2[3][0]} value={config2[3][1]} />
          <CheckboxCompones field={config2[4][0]} value={config2[4][1]} />
          <CookieMatch field={config2[5][0]} value={config2[5][1]} />
          <CheckboxCompones field={config2[4][0]} value={config2[4][1]} />
          <CheckboxCompones field={config2[6][0]} value={config2[6][1]} />
          <CheckboxCompones field={config2[7][0]} value={config2[7][1]} />
          <CheckboxCompones field={config2[8][0]} value={config2[8][1]} />
          <CheckboxCompones field={config2[9][0]} value={config2[9][1]} />
          <CheckboxCompones field={config2[10][0]} value={config2[10][1]} />
          <CheckboxCompones field={config2[11][0]} value={config2[11][1]} />
          <CheckboxCompones field={config2[12][0]} value={config2[12][1]} />
          <CheckboxCompones field={config2[13][0]} value={config2[13][1]} />
          <CheckboxCompones field={config2[14][0]} value={config2[14][1]} />
          <CheckboxCompones field={config2[15][0]} value={config2[15][1]} />
          <CheckboxCompones field={config2[16][0]} value={config2[16][1]} />
          <CheckboxCompones field={config2[17][0]} value={config2[17][1]} />
          <CheckboxCompones field={config2[18][0]} value={config2[18][1]} />
          <CheckboxCompones field={config2[19][0]} value={config2[19][1]} />
          <CheckboxCompones field={config2[20][0]} value={config2[20][1]} />
          <CheckboxCompones field={config2[21][0]} value={config2[21][1]} />
          <CheckboxCompones field={config2[22][0]} value={config2[22][1]} />
        </Space>
      </Col>
      <Col span={12}>
        <Divider margin='12px' align='left'>getsets_0-选项</Divider>
        <TreeSelectData title='getsets_0' data={getsets_0} />
        <Divider margin='12px' align='left'>getsets_0-选项</Divider>
        <TreeSelectData title='getsets_1' data={getsets_1} />
        <Divider margin='12px' align='left'>getsets_0-选项</Divider>
        <TreeSelectData title='funcs_0' data={funcs_0} />
        <Divider margin='12px' align='left'>getsets_0-选项</Divider>
        <TreeSelectData title='funcs_1' data={funcs_1} />
        {/* <CheckboxsCompones configs={getsets_0} /> */}
        {/* <CheckboxsCompones configs={getsets_1} />
        <CheckboxsCompones configs={funcs_0} />
        <CheckboxsCompones configs={funcs_1} /> */}
      </Col>
    </Row>
  </Form>
}