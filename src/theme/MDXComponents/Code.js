import React from 'react';
import CodeInline from '@theme/CodeInline';
function shouldBeInline(props) {
  return (
    // empty code blocks have no props.children,
    // see https://github.com/facebook/docusaurus/pull/9704
    typeof props.children !== 'undefined' &&
    React.Children.toArray(props.children).every(
      (el) => typeof el === 'string' && !el.includes('\n'),
    )
  );
}

function CodeBlock(props) {
  return (<>
    <code {...props} />
  </>);
}

export default function MDXCode(props, others) {

  const ok = props;
  return shouldBeInline(props) ? (
    <CodeInline {...props} />
  ) : (
    <>
      <CodeBlock {...props} />
    </>
  );
}
