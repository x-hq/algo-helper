import { JSDOM } from "jsdom";
import { logger } from "../../../src/utils/logger";

function cleanNode(node: Element): string {
  if (!node) return null;
  const clone = node.cloneNode(true) as Element;
  return clone.outerHTML;
}

export const jsDOMFindHTMLNode = (domStr: string): string | undefined => {
  logger.log("PROCESSING DOM");
  const dom = new JSDOM(domStr);

  // Continue with markdown node
  const nodeFns = [
    ".MarkdownOutput",
    ".page .markdown",
    '[data-track-load="description_content"]',
    ".splitPane .paneContent",
    ".problem-statement-container",
    ".hackdown-content",
  ];
  const cleanFoundNodes: string[] = [];

  try {
    nodeFns.forEach((selector) => {
      const local = dom.window.document.querySelector(selector);
      cleanFoundNodes.push(cleanNode(local));
    });
  } catch (e) {
    logger.log("Could not find nodes", e);
  }

  return cleanFoundNodes.filter(Boolean)?.[0];
};
