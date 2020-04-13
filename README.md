#Project 9

With this project, you can see a Rest API created using Express . In here you will find:

- Uses of Express, NPM, and Node.JS
- Handling validation and creating data models 
- Setting a server
- Initializing and utilizing Sequelize/CLI and SQLite
- Hashing passwords
- Implementing User authenication. 
- Handling Data relationships
BY Justin Black

Going for Meet Expectations

Elements that Need Work
User Routes
One or more of the user routes specified are unavailable or are returning data not formatted as specified
Reviewer Comments:
Your User routes are looking and working really well, but there's one detail that is missing. When successfully creating a new user, that route should also set the Location header to "/". Right now, I'm not seeing that being set.

(Updated Location Header)



Course Routes
One or more of the following course routes are unavailable or are returning data not formatted as specified
Reviewer Comments:
Your course routes are looking and working great, but there is an issue. Like the User routes, when you create a new course, you'll need to set the Location header to the url of the new course, like /courses/4.

(Updated Location Header)


Validations
The POST and PUT routes don't validate if the request body doesn’t contain the following required values:
User
firstName
lastName
emailAddress
password
Course

title
description
Validation error(s) aren't sent with a400 status code

Reviewer Comments:
Your validations are working well, but I'm having an issue on the the Update route for courses. This route should require both the title AND description in order for an update to be made. Right now, it allows me to update the course when I only provide title OR description.

(Not sure what the issue is with this one. This requires both description and title. I tested this, and when I leave title or description blank, it returns an error. I'm assuming previous reviewer submitted a request for only one to be updated (title or description) and the course updated. If that's the case, description and/or title should still have previous data loaded and should not render an error. If this not correct, I will need further clarification on the issue.)
