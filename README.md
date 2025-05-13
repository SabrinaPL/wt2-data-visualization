# Project Title

Gender Equality in Movies Visualizer

## Project Description

The Gender Equality in Movies Visualizer is a data visualization application that aims to provide insights into gender equality in the film industry. The data includes information from a large dataset (over 100 000 data points) about cast and crew members in movie productions and their gender representation. This gives a comprehensive overview of gender distribution across various roles in the film industry (such as Acting or Directing), how gender distribution differs depending on the production country, movie genre and how gender distribution has changed over the years based on the movie production year. The data aims to provide insights into potential gender gaps in the film industry and how they have evolved over time.

The dataset was chosen because it provides a large set of data ranging over a long time period (1874-2020) and includes a variety of different movie genres, production countries and departments. This allows for a comprehensive analysis of gender representation in the film industry. The dataset is publicly available and can be found [here](https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset).

## Core Technologies

### Backend (REST API)

- Python
- Flask
- MongoDB

Python was chosen as the programming language for the backend because it's a recommended and widely used language for data analysis. Flask was chosen as the backend framework because it is easy to use (it has similarities to Express.js of which I'm previously familiar) and is well suited for building RESTful APIs. MongoDB was chosen as the database also because of its ease of use and flexibility. It allows for easy storage and retrieval of data in a JSON-like format well suited for the application and offers aggregation pipeline methods to process and compute data for the visualization.

### Frontend

- TypeScript
- Vue.js
- Pinia
- Apache Echarts

TypeScript was chosen as the programming language for the frontend because it provides type safety, which helps to catch errors earlier in the development process. Vue.js was chosen as the frontend framework because I have some previous experience with it and it's well suited for building interactive web applications. Pinia was chosen as the state management library because it is the recommended state management library for Vue 3. Apache Echarts was chosen as the data visualization library since it was one of the recommended libraries for the assignment, felt intuitive and provided many different graphs to choose from and examples to get started with.

### Deployment

- Docker
- Heroku
- Netlify

I chose to dockerize the application to ensure that it runs consistently across different environments and to make it easier to deploy. The API was dockerized and deployed to Heroku via DockerHub and the frontend was deployed to Netlify. This allows for easy deployment and scaling of the application. Heroku was chosen as the backend deployment platform because of its ease of use and ability to scale. Netlify was chosen as the frontend deployment platform also because of its ease of use. Deployment of both frontend and backend was done via CI/CD pipelines to ensure that the application is always up to date and to automate the deployment process.

## How to Use

### Gender Equality by Movie Production Country

Gender distribution by movie production country is visualized with a map chart and pie charts. The map chart and pie chart are linked, so when you click on a country in the map chart the pie chart will update to give a better view of that specific country data. The map also has tiny pie charts that, when hovered over, show the percentage of gender distribution in that country. The pie chart can be toggled to show either count or percentage per country and a drowdown menu allows filtering by production country based on country code:

<img src="./src/public/images/Movie Visualizer Production Countries.gif" alt="Movie Production Countries Statistics Demo" width="400" height="300" />

### Gender Distribution by Movie Genre

Gender distribution by movie genre is visualized with a bar chart. The bar chart can be toggled to show either count or percentage and a dropdown menu allows filtering by genre based on genre name:

<img src="./src/public/images/Movie Visualizer Genres.gif" alt="Movie Genres Statistics Demo" width="400" height="300" />

### Gender Distribution by Movie Production Year

Gender distribution by movie production (release) year is visualized with a line chart. The line chart can be toggled to show statistics for all years or a specific pre-set year interval:

<img src="./src/public/images/Movie Visualizer Year.gif" alt="Movie Release Years Statistics Demo" width="400" height="300" />

### Gender Distribution by Movie Department (e.g. Acting or Directing)

Gender distribution by movie department is visualized with a bar chart. The bar chart can be toggled to show either count or percentage and a dropdown menu allows filtering by department based on department name:

<img src="./src/public/images/Movie Visualizer Department.gif" alt="Movie Departments Statistics Demo" width="400" height="300" />

## Link to the Deployed Application

[Gender Equality in Movies Visualizer](https://movie-visualizer.netlify.app/)

## Link to frontend and backend repositories

- [Frontend Repository](https://github.com/SabrinaPL/wt2-data-visualization)
- [Backend Repository](https://github.com/SabrinaPL/rest-api)

## Additional features

* The dataset contains over 100 000 data points, which by far exceeds the minimum requirement of 1000 data points.
* Aggregation pipelines were implemented to process and compute data on the backend for the visualization, improving performance and reducing the load on the client side.
* Compound indexing was implemented to optimize query performance, as recommended.
* The application backend is fully dockerized and deployed to Heroku via DockerHub, and the frontend is deployed to Netlify. Both deployments are done via CI/CD pipelines to ensure that the application is always up to date and to automate the deployment process.
* A total of 5 interactive visualizations were implemented, which exceeds the minimum requirement, and they include controls like toggles, dropdown menus and linked charts to enable dynamic exploration of the data.
* Caching (Pinia store) was implemented on the frontend to improve performance by reducing the number of requests made to the api.

### Backend

- [x] Implemented a RESTful API using Flask to serve data to the frontend.
- [x] Created a separate MongoDB collection for storing the data used for the visualization.
- [x] Implemented compound indexing to optimize query performance.
- [x] Implemented aggregation pipelines to process and compute data for the visualization, 
  including calculating the percentage, to enable effective data retrieval and analysis and lower the load on the client side.

### Frontend

- [x] Implemented caching (set up a Pinia store) to improve performance and reduce the number of requests made to the server.
- [x] Implemented filtering options to allow interactive exploration of the data.

## Acknowledgements

Apache Echarts graph library was very helpful in getting started with the graphs and provided many examples to choose from and to customize
