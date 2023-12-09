import React from "react";
import { Button, Result } from "antd";
type Props = {};

export default function Error({}: Props) {
  return (
    <div>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary">Back Home</Button>}
      />
    </div>
  );
}
