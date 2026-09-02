const fs = require('fs');
let c = fs.readFileSync('data/defaultCourseReviews.ts', 'utf8');
c = c.replace(/color":/g, 'color:');
c = c.replace(/date":/g, 'date:');
c = c.replace(/text":/g, 'text:');
c = c.replace(/rating":/g, 'rating:');
c = c.replace(/initials":/g, 'initials:');
c = c.replace(/name":/g, 'name:');
fs.writeFileSync('data/defaultCourseReviews.ts', c);
