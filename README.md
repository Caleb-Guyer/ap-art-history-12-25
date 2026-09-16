# AP Art History · Works 12–25

A minimal image-recall study app for Ancient Near Eastern and Egyptian art.

## Features

- Eight study categories: all details, details, recommendation, names, materials, dates, locations, and culture/period.
- Recommendation practices one short extra detail per work in typed or multiple-choice mode. It is also available as the mock quiz’s third answer and in Quick review. The 14 works reuse nine answers: 3000 BCE, 2700 BCE, 2500 BCE, Giza/Egypt, 1750 BCE, Egyptian/New Kingdom, Amarna/Egypt, Egypt, and 720 BCE. Date checking still accepts any year in the work’s listed range.
- Details combines dates, locations, and culture/period. Typed recall shows these together; multiple choice covers 42 questions across the 14 works.
- Typed recall or four-option multiple choice for every category. All-details multiple choice covers all 70 eligible work/category combinations, with instant feedback and missed-question practice.
- Fourteen works with thirty course images, including alternate views and associated objects.
- A typed or multiple-choice mock quiz: identify the image with its **name, complete material line, and a chosen date, location, or culture/period**. Change the third category for each work. Hatshepsut’s location question accepts either Deir el-Bahri, Egypt or Senenmut. Both appear as correct multiple-choice options; selecting either earns one point.
- Audio mode cycles through all 14 works, reading each name, complete material answer, and recommendation. Includes play/pause, previous/next, seeking, playback speed, and repeat. Audio pauses when leaving the Audio tab and never changes study scores.
- Full, seven-work, and five-work quizzes; optional timer and alternate views.
- Material checking that catches omitted inlays, supports, colors, and surface treatments.
- Suggested marks for typed answers, automatic multiple-choice scoring, and adjustable grading before saving.
- Concise study answers and choices omit parenthetical explanations; the shorter forms receive credit. Full source wording and aliases stay available in the data, and essential material components remain required.
- Missed-answer practice and device-local saved sessions; progress import/export.
- Material comparisons, dates, vocabulary, and printable identification details.
- Keyboard, mobile, and reduced-motion support. No sign-in or API key required.

## Run locally

Requires Node.js 20 or later. There are no package dependencies to install.

```sh
npm start
```

Open `http://127.0.0.1:4173/`. All public files are in `dist/`; any ordinary static web server can serve that directory. Use a web server, not a `file://` URL, because the app uses JavaScript modules.

```sh
npm test
npm run check
```

## Hosting

The site is static. Deploy the contents of `dist/` as the public root. Navigation uses URL fragments, so no server-side route fallback is required. Asset references are relative and also work under a GitHub Pages project path.

`.openai/hosting.json` records the Sites deployment identity. It contains no credentials. The GitHub workflow checks the content and quiz logic on each push and pull request.

## Content and grading

Primary source: the course PDF **Unit 2 ANCIENT NEAR EASTERN ART.pdf**, images 12–25. Each record in `dist/data.js` lists one-based PDF page numbers. Supplementary scholarly or museum sources appear only where needed and are linked in the work notes.

The app preserves course material terminology and explicitly lists conflicting slide dates. For example, the White Temple has two date ranges in the slides; the app accepts both. Hammurabi uses **basalt** to match this course. Makers are distinguished from patrons and depicted rulers. Senenmut is described as an attributed architect, not a securely documented signature.

The gold death mask on slide 80 is a separate object from Tutankhamun’s innermost coffin. It appears as a related study image and is excluded from the mock quiz. Plans with labels are also excluded from quiz sampling. Alternate views of Hatshepsut’s associated sculpture still refer to the full assigned-work material line.

Practice marking is deterministic and uses no AI service. Each quiz has three points per work. Blank fields receive zero. Recognized typed answers receive suggested credit; ambiguous wording remains pending for review. The third answer is checked against the selected category, rather than an arbitrary contextual fact. Final results can be saved only after every pending mark is resolved.

Any individual year within a listed course range is accepted, including the endpoints and alternative slide ranges. An omitted era is interpreted as BCE; CE/AD is rejected. A smaller range is accepted when both endpoints fall within one listed range. Karnak has two separate milestones (temple 1550 BCE; hall 1250 BCE), so years between those milestones are not accepted. Multiple-choice date distractors do not overlap any accepted range. Equivalent material and artist options are deduplicated.

Context questions and questions about unknown artists are excluded from study. Senenmut’s traditional attribution for Hatshepsut’s temple is combined with its location question, with no separate Artist category. Saved sessions skip retired questions and retain their responses; active quizzes move Hatshepsut’s Artist answer into Location and move unknown-artist prompts to Date while keeping the previous answer in the export. Completed quiz results remain intact.

Previous saved answers and progress remain available. Older quizzes without a third-answer category prompt for one when resumed; already reviewed legacy results retain their marks.

## Privacy

Progress and typed answers stay in local browser storage. There is no account, backend database, analytics, or shared class leaderboard. Audio uses bundled speech recordings with no microphone permission, API key, or speech service at playback time. Each visitor has separate progress. Export a progress file to move it between devices. A timer continues while a quiz is saved and exited.

## Audio assets

The WAV clips in `dist/audio/` use the same concise names, materials, and recommendations as the study interface. `narration.json` records the displayed text and pronunciation wording. To update recordings on Windows, run `node scripts/audio-input.mjs TEMP_JSON_PATH`, then `scripts/generate-audio.ps1 -InputJson TEMP_JSON_PATH`. This uses the installed Microsoft Zira Desktop voice; the committed recordings play on other platforms through standard browser audio. The content check detects stale narration.

## Image rights

Artwork images were extracted from the supplied teaching PDF. `dist/images/sources.json` records the source slide of each image. Copyright in photographs and reproductions remains with the original rights holders; this repository does not assert a blanket license for those images. The source PDF itself is not redistributed here.

## Structure

```text
dist/
  index.html      entrypoint
  app.js          interface, sessions, and local progress
  data.js         artworks, accepted answers, and references
  engine.js       checking, grading, and saved-data validation
  styles.css      shared visual styles
  compact.css     minimal layout and responsive adjustments
  images/         artwork images and provenance manifest
scripts/          local server and content checks
tests/            answer and session regression tests
```
