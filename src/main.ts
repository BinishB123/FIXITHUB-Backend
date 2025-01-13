import server from "./framework/app";
import connectDb from "./framework/mongo/mongoConfig";

connectDb();

server.listen(3000, () => {
    console.log("server started on port 3000");
});
                    