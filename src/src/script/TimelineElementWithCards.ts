import { MarkdownRenderer, MarkdownRenderChild } from "obsidian";
import TimelineElement from "./TimelineElement";

export default class TimelineElementWithCards extends TimelineElement {
    public addEvent = (info: TimelineEventInfo) => {
        Object.entries(info).map(([key, val]) => {
            const element = this.getElement().createDiv({cls: key});
            
            // 使用MarkdownRenderer渲染内容，确保内部代码块能被正确处理
            const markdownChild = new MarkdownRenderChild(element);
            MarkdownRenderer.renderMarkdown(val, element, this.sourcePath, markdownChild);

            return [key, element];
        });
    };
}