const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

const uploadButton = document.getElementById("uploadButton");
const photoInput = document.getElementById("photoInput");

uploadButton.addEventListener("click", () => {
    photoInput.click();
});

photoInput.addEventListener("change", async () => {
    const file = photoInput.files[0];

    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabaseClient.storage
        .from("Photo's")
        .upload(fileName, file);

    if (error) {
        console.error(error);
        alert("Upload failed: " + error.message);
        return;
    }

    alert("Photo uploaded successfully! 📸");
});
