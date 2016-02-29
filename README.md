# PhotoDrop

PhotoDrop is a location-based photo sharing iPhone app. It allows iOS users to find and share photos based on their current geolocation. PhotoDrop offers two main functions: PhotoShare and PhotoExplore. With PhotoShare, users can take photos with the app and store them at their current location for other users to see. With PhotoExplore, users can open the app and see the photos that other users have stored at their current location.

![super agent](https://raw.githubusercontent.com/ProfoundMongoose/PhotoDrop/master/client/images/logoresized.png)

## Installation

Requirements:
- OS X is needed for iOS development
- Xcode 7.0 or higher [download here](https://developer.apple.com/xcode/download/)
- npm [install here](http://blog.npmjs.org/post/85484771375/how-to-install-npm)
- rnpm [install here](https://github.com/rnpm/rnpm)

__Step 1: Run 'npm install' from the root directory__

```
$ npm install
```

__Step 2: Run 'rnpm link' from the root directory__

```
$ rnpm link
```

__Step 3: Add fonts in the Xcode project__
In your Xcode project, add the 'lineto-circular-medium.ttf' font file to the main 'PhotoDrop' project. You can do this by control clicking on the PhotoDrop project and selecting 'Add File to "PhotoDrop"...'. You'll find the 'lineto-circular-medium.ttf' font file inside the repo (client > App > Components > Assets). 

![super agent](http://i.imgur.com/gZ9fyt4.png)

Click on the font file that you've just added in the left-hand column, and double-check that the PhotoDrop app is selected under 'Target Membership' on the right column.

![super agent](http://i.imgur.com/7HtXntz.png)

Click on your 'PhotoDrop' project file in the left hand column, then select “Build Phases”. Make sure that your font has been added under “Copy Bundle Resources” (this should have been done automatically).

![super agent](http://i.imgur.com/HyHgrbR.png)

In your main app folder in the 'PhotoDrop' Xcode project, select info.plist. After this is selected, click on “Information Property List”, and then click the plus sign. In the dropdown, choose “Fonts provided by application”. Copy and paste 'lineto-circular-medium.ttf' under 'Value' on the right hand column of this row.

![super agent](http://i.imgur.com/rcn9Q3u.png)

__Step 4: Add RCTCustom.m in the Xcode project__
In your Xcode project, add the 'RCTCustom.m' file in the 'Base' folder in the 'PhotoDrop' project (PhotoDrop > Libraries > React.xcodeproj > React > Base). You can do this by control clicking on the 'Base' folder and selecting 'Add File to "React.xcodeproj"...'. You'll find the 'RCTCustom.m' file inside the repo (client > App > Components > Assets).

![super agent](http://i.imgur.com/AKDxeVV.png)

## Run Simulator

In order to run the simulator, navigate to the 'AppDelegate.m' file under the 'ProfoundMongoose' folder. You'll see two options for loading JavaScript code:

1. If you want to run the XCode iPhone simulator from a development server (e.g., localhost), uncomment Option 1 and comment-out Option 2. Then, click the play button in the top-left corner (or Command + R).
2. If you want to run the simular on a physical iPhone device from a pre-bundled file on disk running on a remote server (e.g., Digital Ocean droplet), comment-out Option 1 and uncomment Option 2. Then, click the play button in the top-left corner (or Command + R).
