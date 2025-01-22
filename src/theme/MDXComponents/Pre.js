import React from 'react';

import clsx from "clsx";
import CopyButton from '@theme/CodeBlock/CopyButton';

import styles from './styles.module.css';

import { usePrismTheme } from '@docusaurus/theme-common';
import { getPrismCssVariables } from '@docusaurus/theme-common/internal';

export default function MDXPre(props) {

  // With MDX 2, this element is only used for fenced code blocks
  // It always receives a MDXComponents/Code as children
  const code = props["data-code"];
  const title = props["title"];
  console.log("Code:" + props.lang);

  const prismTheme = usePrismTheme();
  const prismCssVariables = getPrismCssVariables(prismTheme);

  const prepProps = { ...props, className: clsx(props.className), style: {} };

  return <>
    <div style={prismCssVariables} className={clsx(styles.codeBlockContainer, "theme-code-block")}>

      {(props.lang || props.title) &&
        < div className={styles.codeBlockTitle} style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{title}</span>
          {props.lang && <span style={{ fontSize: "small", fontWeight: "bolder" }}>{props.lang}</span>}
        </div>
      }
      <div className={styles.codeBlockContent}>
        <pre  {...prepProps} />
        <div className={styles.buttonGroup}>
          <CopyButton className={styles.codeButton} code={code} />
        </div>
      </div>
    </div >
  </>;
}
