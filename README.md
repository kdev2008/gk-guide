# GK Guide V4 — Complete GitHub Website

Upload the CONTENTS of this folder to the ROOT of your GitHub Pages repository.

Expected structure:

index.html
article.html
css/styles.css
js/config.js
js/app.js
js/article.js
js/v4-data.js
data/latest.json
data/quiz.json
assets/fallback/*.jpg

## Important

1. V4 Apps Script publishes directly to:
   - data/latest.json
   - data/quiz.json

2. The website reads those files automatically.

3. To show the Admin button, open:
   `js/config.js`

   Set:

   ADMIN_URL: 'YOUR_APPS_SCRIPT_EXEC_URL'

4. GitHub Pages must publish the repository root.

5. After upload, first test:
   - yoursite/data/latest.json
   - yoursite/data/quiz.json

6. Run `runDailyPublisherV4` in Apps Script. GitHub should update the two JSON files automatically.

7. Refresh the homepage. New stories, images, categories, source names and quiz will render automatically.

## Source display

Every homepage story card and article page displays the source name.
The source links open the original publisher page.

## Image behavior

The backend tries source `og:image` / Twitter image metadata.
If no image is available, the website uses an owned category fallback image.

## Old V3 files

If you replace the repository completely, you do not need:
- js/v3-data.js
- old V3 JSON/code files

The complete package is V4-ready.
