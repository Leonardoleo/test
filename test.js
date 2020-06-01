import { jexiaClient, dataOperations, realTIme } from "jexia-sdk-js/node"; // "jexia-sdk-js/browser" for browser applications
const dataModule = dataOperations();

jexiaClient().init(credentials, dataModule, realTIme, {
    projectID: "<your-project-id>",
    key: "<your-project-api-key>",
    secret: "<your-project-api-secret>",
}, dataModule);

const posts = dataModule.dataset("posts");

const insertQuery = posts.insert([
    { title: "New Post", content: "content here" },
    { title: "Another Post", content: "some more content" }
]);

// At this point nothing has happened yet
// we need to call subscribe in order to run a query
insertQuery.subscribe();

// Single record
const insertQuery = posts.insert({
    title: "New Post",
    content: "content here"
}).subscribe();

// Either way, the response will be an array
insertQuery.subscribe(records => {
        // you will always get an array of created records, including their generated IDs (even when inserting a single record)
    },
    error => {
        // you can see the error info here, if something goes wrong
    });

const posts = dataModule.dataset("posts");

posts
    .update({ title: "Same title for tom and harry posts" })
    .where(field => field("author_name").isInArray(["Tom", "Harry"]))
    .subscribe(affectedRecords => {
        /* [{ title: "Same title for tom and harry posts", author_name: "Tom" },
            { title: "Same title for tom and harry posts", author_name: "Tom" },
            { title: "Same title for tom and harry posts", author_name: "Harry" },
            { title: "Same title for tom and harry posts", author_name: "Tom" }]
         */
    });

const posts = dataModule.dataset("posts");

posts
    .delete()
    .where(field => field("title").isLike("%test%"))
    .subscribe(deletedFields => {
        // you will be able to access the deleted posts here
        // they are not stored in the DB anymore, but maybe you
        // want to display a visual confirmation of what was deleted
    });

const subscription = dataModule.dataset("posts")
    .watch("created", "updated", "deleted")
    .subscribe(messageObject => {
        console.log("Realtime message received:", messageObject.data);
    }, error => {
        console.log(error);
    });