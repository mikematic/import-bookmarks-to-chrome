# import-bookmarks-to-chrome
Chrome extension for bulk import of bookmarks into Chrome.

### Installing
1. Download or clone this repository `git clone https://github.com/mikematic/import-bookmarks-to-chrome.git`
2. Open (chrome://extensions/) or select the menu `Window > Extensions`.
3. Enable the developer mode at top right.
4. Click `Load unpacked extension...` and select the source code folder.
5. You're ready to import!

### Using
1. Click the blue Kinopio icon for the extension

2. Paste your import data in format below

### Sample input JSON for import
```json
      [{
          "title": "Google",
          "url": "https://www.google.com/",
          "tags": [
            "search engine",
            "cloud"
          ]
        },
        {
         "title": "Amazon",
         "url": "https://www.amazon.com",
         "tags": [
           "shopping"
         ]
       }]
```

3. Click import!

4. The bookmarks will be added in a folder named 'Imported From Delicious' under the bookmarks bar

### More info
The main purpose I developed this extension was to help in bulk importing of my del.icio.us bookmarks into chrome. [del.icio.us](https://del.icio.us/) seems to be currently running out of business and I needed to migrate my bookmarks into another reliable bookmark manager like Chrome. However, del.icio.us have disabled the feature to export bookmarks and I had more than one thousand bookmarks that were kind of held hostage. I was able to download my bookmarks using the wget tool albeit in html format cluttered with a lot of html tags. I wrote a Java [program](https://github.com/mikematic/deliciousparser) to parse these htmls into one clean JSON input that can be used by this extension to import into Chrome bookmarks. For more details about the export and import process look into the instructions of the Java program [deliciousparser](https://github.com/mikematic/deliciousparser) that is also available on github.

### Contributions
Stick a fork at it

### License
Apache
