# Letflix Challenge for LiteBox

- **Author**: Juan Pablo Medina (`@juanpablomedina-dev`)

- **Version**: 1.0.0

### Instructions to run locally in development.

1. The _node package manager_ (`npm`) is needed to run the project in development. It comes with Node.js, see https://nodejs.org/es. Also `git` (https://git-scm.com/) to retrieve the project and basic Terminal knowledge.

2. Clone the project with `git clone https://github.com/juanpablomedina-dev/liteflix_code.git`

3. Install all dependencies with `npm install`.

4. Run the project with `npm run dev`. It runs in the browser at http://localhost:5173/

## Code fundamentals.

The instructions below serve as an introduction to the project code, and tries to help understanding it's structure and flow.

### Dependencies and Technologies

The project has few production-dependencies (those included in the build).

- `react`: The main library ('framework') with several components and hooks to help building the App.
- `react-dom`: The processes that actually transform all react components and work code into a web page.
- `react-router-dom`: A fundamental library for working with routing in react. It's intuitive and easy to use.
- `react-icons`: A very useful collection of icons that can be imported separadely without compromising the final bundle.

Then for the development-dependencies (not included in the build) there are two main ones:

- `tailwindcss`: An spectacular CSS framework that incredibly speeds-up styling without actually including anything in the project; all of it is processed into pure CSS when building.
- `vite`: A modern lightweight building technology used to set up the development environment and build the final bundle.

### Project Structure.

- **Outside `/src`**: Configuration files, being the most important:

  - `index.html`: The starting point of the App.

  - `tailwind.config.js`: Configuration file for TailwindCSS that allows to programatically add new utilities.

  - `package.json`: Default configuration file of `npm` to keep track of everything including dependencies.

  - `vite.config.js` & `jsconfig.json`: To set the aliases used to import everything in the project.

- **`/assets`**: All assets in the project are placed here, including _fonts_ and _images_ for example.

- **`/components`**: Miscellaneous react components that wouldn't be appropiate to place inside `/pages`, like the icon components.

  - `Navigation`: The component including the top bar and the side bar used in the App.

- **`/pages`**: Everything associated to a page and specific of it, from an entire page component to just a single box that's inside a section of a page.

  - `AddMovie`: The page for adding a movie, including the formulary with it's attaching box.

  - `Home`: The main page displaying the main movie in big, and the list of popular/added movies.

- **`/static`**: Pure JS functions and constant values that are used in multiple files in the project. (Single-file use functions/constants are defined in the file they're used.)

- **`/tools`**: Collection of _hooks_, _HOCs_, and other tools used in the project. For this project there are hooks only.

  - `useInitialFetch`: A very useful hook to avoid duplicated code and keep consistency of set-up requests done throughout the App.

- **`App.jsx`**: The main component of the App, used for any before-anything process (like requesting a configuration).

- **`index.css` and `index.jsx`**: Starting points for both CSS/Tailwind and React. In `.css` there are several custom classes to help styling. In `.jsx` there are wrapper-components (like `BrowserRouter` of `react-router-dom`) needed to work.

### Efficiency, Accesibility and Scalability.

- **Lots of pure CSS**: All transitions and conditionally applied styling is made with mostly pure CSS and minimal JS, keeping everything flowing efficiently and smoothly.

- **Efficient and well-thought React**: All components are deeply developed with efficiency in mind, trying to keep as less process-garbage as possible and minimizing renders.

- **Mindful HTML**: The HTML used in the project is written with accesibility in mind. The DOM is clear and well-structured, and all actions can be performed with keyboard-only.

- **Scalable structure**: The project is built to be scalable. The components, pages, tools, values and connections between them were developed to be expandable into a complex and large Application.

### Documentation and Readability.

- **`JSDoc`s**: Everything in the project except the react components is formally documented with `JSDoc`s, helping the IntelliSense of editors and therefore be a huge help for development. They're highly worth the time.

- **Comments and Readability**: Aside formal documentation, all code is written to be as readable as possible. It's also well commented without being annoying.
