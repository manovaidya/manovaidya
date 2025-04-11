import mongoose from 'mongoose';

const connectDb = async (URL) => {
    try {
        const connection = await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("manovedya MongoDB connected:", connection.connection.host);
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1); // Exit the process with failure
    }
};

export { connectDb };