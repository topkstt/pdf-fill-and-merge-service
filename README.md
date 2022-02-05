
# PDF Fill And Merge Service

Demo project for @topkstt/pdf-fill-thai package




## Features

- Fill PDF Template Data
- S3 Upload After Fill Completed
- Merge PDF File Using URL



    
## Run Locally via Node.js

Clone the project

```bash
  git clone https://github.com/topkstt/pdf-fill-and-merge-service.git
```

Go to the project directory

```bash
  cd pdf-fill-and-merge-service
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## Run Locally via Docker Compose

Clone the project

```bash
  git clone https://github.com/topkstt/pdf-fill-and-merge-service.git
```

Go to the project directory

```bash
  cd pdf-fill-and-merge-service
```

Run Docker Compose

```bash
  docker-compose up
```

Access service via 3050 port or set port in .env


## API Reference

#### Fill PDF Template

```http
  POST /fill
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `template_name` | `string` | **Required**. Your template file name (in pdf_template folder) |
| `font_name` | `string` | **Required**. Accept only Kanit,Prompt,Sarabun |
| `font_size` | `float` | **Required**. Font size to fill data in float |
| `fill_data` | `array` | **Required**. Your API key |

#### Merge PDF File

```http
  POST /merge
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `lists`      | `array` | **Required**. List of pdf url to merge |

