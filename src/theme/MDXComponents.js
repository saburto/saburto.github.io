import React from "react";
import MDXComponents from "@theme-original/MDXComponents";
import { useBlogPost } from "@docusaurus/theme-common/internal";
import { useWindowSize } from "@docusaurus/theme-common";

import TOCCollapsible from "@theme/TOCCollapsible";

function Highlight({ children, color }) {
  return (
    <span
      style={{
        backgroundColor: color,
        borderRadius: "2px",
        color: "#fff",
        padding: "0.2rem",
      }}
    >
      {children}
    </span>
  );
}

function BlogTOCMobile() {
  const { metadata, toc } = useBlogPost();
  const { frontMatter } = metadata;

  const windowSize = useWindowSize();

  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0 && windowSize === "mobile";

  return (
    canRender && (
      <TOCCollapsible
        toc={toc}
        minHeadingLevel={frontMatter.toc_min_heading_level}
        maxHeadingLevel={frontMatter.toc_max_heading_level}
      />
    )
  );
}

export default {
  ...MDXComponents,
  Highlight,
  BlogTOCMobile,
};
