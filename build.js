const fs = require('fs')

fs.rm("dist", { recursive:true }, (err) => {
    if(err){
        // File deletion failed
        // console.error(err.message);
        return;
    }
    // console.log("File deleted successfully");
      
    // List files after deleting
    // getCurrentFilenames();
})