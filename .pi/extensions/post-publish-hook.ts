import * as fs from "node:fs";
import * as chokidar from "chokidar";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
	pi.on("session_start", async (_event, ctx) => {
		const blogDir = "src/content/blog";
		if (!fs.existsSync(blogDir)) return;

		// Map to keep track of the previous draft state
		const draftStates = new Map<string, boolean>();

		// Helper to check if a file has `draft: true`
		const isDraft = (content: string) => {
			const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
			if (!frontmatterMatch) return false;
			const frontmatter = frontmatterMatch[1].trim();
			return /^draft:\s*true/m.test(frontmatter);
		};

		// Initialize states
		fs.readdirSync(blogDir).forEach((file) => {
			if (file.endsWith(".md")) {
				const path = `${blogDir}/${file}`;
				try {
					const content = fs.readFileSync(path, "utf-8");
					draftStates.set(path, isDraft(content));
				} catch (e) {}
			}
		});

		chokidar
			.watch(blogDir, { ignoreInitial: true })
			.on("change", (path) => {
				if (!path.endsWith(".md")) return;

				try {
					const content = fs.readFileSync(path, "utf-8");
					const currentlyDraft = isDraft(content);
					const previouslyDraft = draftStates.get(path);

					// If it was draft (or unknown) and is now NOT draft
					if (previouslyDraft !== false && currentlyDraft === false) {
						pi.sendMessage(
							{
								customType: "post-publish-hook",
								content: `The post \`${path}\` has been changed from draft to published (draft: false or removed). Please run the \`post-review\` skill on this file to verify it meets publish standards. If there are issues, prompt me or fix them based on the skill rules.`,
								display: true,
							},
							{ triggerTurn: true }
						);
					}

					draftStates.set(path, currentlyDraft);
				} catch (e) {
					console.error("Error reading changed blog post:", e);
				}
			});

		if (ctx.hasUI) {
			ctx.ui.notify(
				`Blog Post Review Hook watching ${blogDir} for draft->publish changes`,
				"info"
			);
		}
	});
}