import { Plugin, MarkdownView, TFile } from "obsidian";

import TagParsers from "./TagParsers";
import TimelineElement from "./TimelineElement";
import TimelineElementWithCards from "./TimelineElementWithCards";

import "../style/styles.sass";
import "../style/timeline-lines.sass";
import "../style/timeline-bodies.sass";

// 使用正向环视替代后向环视以兼容较低版本ES
const classRegex = /^\s*(\[.+?\])/g;

const toClassArray = (input: string): string[] => {
	input = input.trim();
	if (input[0] != "[" || input[input.length - 1] != "]") return [];

	return input
		.substring(1, input.length - 1)
		.trim()
		.split(/\s*,\s*/);
};

export default class TimelinePlugin extends Plugin {
	onload = async () => {
		TagParsers.forEach(({ tag, parser }) => {
			this.registerMarkdownCodeBlockProcessor(tag, (source, root, ctx) => {
				const timelineElement = new TimelineElementWithCards(root, ctx.sourcePath);
				const el = timelineElement.getElement();
				
				el.addClass("timeline");
				const classMatch = source.match(classRegex);
				if (classMatch !== null) {
					const classes = toClassArray(classMatch[0]);
					el.addClasses(classes);
				}

				const events = parser(source);
				events.forEach(e => timelineElement.addEvent(e));
			});
		});

		console.log("timeline load");
	};


	onunload = async () => {
		console.log("timeline onunload");
	}
}
