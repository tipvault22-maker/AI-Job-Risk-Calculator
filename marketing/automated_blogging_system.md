# 100% Automated Blogging System

This scenario automates blog production from RSS discovery through Medium publication. It listens to an AI tools RSS feed, uses Perplexity and ChatGPT to draft a long-form article and SEO headline, generates an image with DALL·E 3, and uploads everything to Medium as a draft.

## Flow overview
1. **AI Tools RSS Topic Retrieval (`rss:TriggerNewArticle`)** – Polls `https://rss.app/feeds/H1tb0v0R10hoM8go.xml` for the newest article (max 1) and exposes fields like `title`, `description`, `url`, and media metadata.
2. **Perplexity: Write Blog Post (`perplexity-ai:createAChatCompletion`)** – Feeds the article title and URL into an SEO-oriented prompt that requests a 1500+ word post tailored to entrepreneurs and marketers, formatted for Medium.
3. **ChatGPT: Generate SEO Title (`openai-gpt-3:CreateCompletion`)** – Crafts a compelling headline from the generated draft using `chatgpt-4o-latest`.
4. **DALL·E 3: Create Blog Image (`openai-gpt-3:GenerateImage`)** – Produces a vivid 1024×1024 cover image from the approved title, explicitly omitting any on-image text.
5. **Medium: Upload Image (`medium:uploadImage`)** – Sends the DALL·E asset to Medium, returning a usable image URL.
6. **Medium: Create Draft Post (`medium:createPost`)** – Publishes the draft in Markdown, combining the Perplexity article, the SEO title, and the uploaded image. The post is saved as a **draft** for review before release.

## Key implementation notes
- The workflow is designed for Make.com (`zone: us2.make.com`) with auto-commit enabled and a single roundtrip.
- Connections for Perplexity, OpenAI, and Medium are referenced by their scoped connection IDs (replace with your own credentials in Make.com before running).
- Image uploads use the binary file path returned by DALL·E (`resImgData`/`resImgName`) to keep the Medium asset properly linked.
- Because the draft is saved to Medium, editors can fine-tune tone, tags, and canonical URLs before publishing.

## File reference
- Full JSON export: [`data/automated_blogging_system.json`](../data/automated_blogging_system.json)
