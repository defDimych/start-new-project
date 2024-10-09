import {app} from "./app";
import {SETTINGS} from "./settings";

// start app
app.listen(SETTINGS.PORT, () => {
    console.log(`Example app listening on port ${SETTINGS.PORT}`)
})