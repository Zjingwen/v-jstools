import { useEffect } from "react";
export default () => {
  useEffect(function () {
    console.log('web hook');
  }, []);
  return <>WebHook</>
}