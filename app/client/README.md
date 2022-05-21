# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Environment Variables

Environment variables are hard to configure for a react app in OpenShift. Since Create React App produces a static HTML/CSS/JS bundle, it can’t possibly read them at runtime. There is additional challenges when using docker-compose.

To get around this there are a few steps.

# Env Variables in React with Docker-Compose

You have 2 options when using docker-compose to build your conatiners.
The goal is to copy the .env file into the container for development or the .env-template for production.

- **Option 1**: The easiest is to have a .env file in the app/client directory. Since this is where your Dockerfile is located, your Dockerfile has access to all the files in this directory. You can copy the .env file or .env-template file into the container using 'COPY .env .' or 'COPY .env-template .'

- **Option 2**: This is the option we went with. Use a single .env file in the root of the project to serve all our containers. The initial problem with this is that our Dockerfile is located 2 directories down from root level so if we told docker-compose the build 'context' was the 'app/client' directory it would not be able to access the .env file in the root directory. To fix this, in the docker-compose you need to specify the build 'context: .' which is root level, and then specify a location for the Dockerfile like 'dockerfile: ./app/client/Dockerfile'. Then any previous copy operations in the Dockerfile need to be prefixed with 'app/client/' because our context level is now 2 directories higher. The only exception is when copying the .env file like 'COPY .env .' which accesses the file from our context level, in this case root level.

- **Local Development vs OpenShift Production switching**: We need to use .env for developement and .env-template for production. In development, we copy the .env file to the container so that we have both sides of the environment variables, the key and the value. In production, we don't have access to the .env because it is in the .gitignore. The first step to getting around this is to use the .env-template file instead. I'll elaborate on how we use these files in the next section.

In order to seamlessly switch between the .env and the .env-template we do something clever. We create an environment variable in the .env file called 'ENV_FILE' with the value '.env'. For development this will specify we are using the .env file. In the docker-compose, we set an 'args' argument called 'env' that is populated with the 'ENV_FILE' variable, or is given a default value of '.env-template' if the variable can't be found. Next we need to use this argument in the Dockerfile by specifying 'ARG env' and then changing our copy command to 'COPY $env .' so it will copy either the .env or .env-template to the container depending on development or production.

# Using .env and .env-template in React

Now that we've copied the .env or .env-template file into our build we need to use them. Copying them into the build still doesn't allow us to use the environment variables, so that's what we'll tackle here.

- First we need to create a 'env.sh' script to run on build that will copy our .env or .env-template into an window object in an env-config.js file that it will create. Once the variables are set in this env-config.js file, we can access them within the react app.

Basically what the env.sh file is doing is creating a window object and loading it with the variables in our .env file. It seperates the keys from the values, copying the keys into the env-config.js first, and then giving it the value of the matching environment variable if it exists outside of the .env file set in the environment, otherwise setting the value to the value specified in the .env if it has one. The script also skips empty or commented lines in your .env file.

To be clear, if an environment variable exists outside of the .env file (in the actual environment), it will use that value, otherwise it will use the value specified in the .env file if it exists.

- In order for this script to run we need to copy it from 'COPY env.sh .' OR 'COPY app/client/env.sh .' in the Dockerfile. Then we need to add bash to the container with 'RUN apk add --no-cache bash' and set permissions for the file with 'RUN chmod g+rwx env.sh' to make it executable. Then we need to include it in our startpoint like so 'CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\" "]'. And finally, start the script in the head section of our 'app/client/public/index.html' with '<script src="%PUBLIC_URL%/env-config.js"></script>'.

- Now that our bash script is working, in local development it will populate our env-config.js with key-value pairs that we can start using right away, and in OpenShift production we currently get an env-config.js file with keys that don't have a value, so lets fix that.

You can either set environment variables in the Dockerfile which will populate your keys with values, or you can set them in OpenShift to populate the keys with values.

- To access these variables in react, instead of using 'process.env' we use 'window._env_'.

# Review for Env Variables

- Environment variables wont be loaded by the REACT APP because Create React App produces a static HTML/CSS/JS bundle, it can’t possibly read them at runtime.
- We need to provide a .env or .env-template file to populate our env-config.js with either key-value pairs in local development, or keys to which we can set values to in OpenShift production.
- We use a bash script to create the env-config.js file which creates a window object to store our variables.
- We access the variables with 'window._env_' instead of 'process.env'.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Building the Front-End Docker Image

## Steps

1. Open terminal
2. Run the following commands:

```
docker build -t react-frontend .
```

this builds the image, then:

```
docker run -d -p 8080:80 react-frontend
```

The `-d` and `-p 8080:80` flags tell the container to run _detached_ (which means it runs in the background) and specifies the port to use, respectively.
