# PeppyPossums

In app.js file, please insert your own google maps API key on line 18

If you would like to use the Locu API, please insert your own Locu API key on line 26 of menu.js

URL for our firebase database
https://rooftopapp.firebaseio.com/ 


Fixes: 
At this point, the database adds duplicate users upon signup(), there are some helpful comments to debug

After a user logs in, there is a bug where the search feature does not put the correct points on the map. This 
error does not occur when a user is not logged in. 

Register.js could be refactored in the promises.

### Mobile Experience

We developed the mobile version of FYR using React Native. To facilitate the development, ExponentJS was used. ExponentJS allowed for the mobile tests to be run on an iOS device, which allow us to *feel* the application we were developing. Head over to ExponentJS's GitHub to install the software. https://github.com/exponentjs/xde

To facilitate `state` management with React, we use Redux. Redux is an alternative to Facebook's Flux architecture. Both architectures allow for unidirectional data flow, which is a core tenant of React development. Check out this fantastic video series on Redux created by the author of the Redux framework: https://egghead.io/lessons/javascript-redux-the-single-immutable-state-tree?series=getting-started-with-redux. This is an indispensible resource for anyone new to Redux.
