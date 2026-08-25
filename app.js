const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

const uploadButton = document.getElementById("uploadButton");
const photoInput = document.getElementById("photoInput");
const gallery = document.querySelector(".gallery");


// ===============================
// UPLOAD PHOTO
// ===============================

uploadButton.addEventListener("click", () => {
    photoInput.click();
});

photoInput.addEventListener("change", async () => {
    const file = photoInput.files[0];

    if (!file) return;

    const fileExtension = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExtension}`;

    const { error } = await supabaseClient.storage
        .from("Photo's")
        .upload(fileName, file);

    if (error) {
        console.error(error);
        alert("Upload failed: " + error.message);
        return;
    }

    alert("Photo uploaded successfully! 📸");

    loadPhotos();
});


// ===============================
// LOAD PHOTOS
// ===============================

async function loadPhotos() {

    gallery.innerHTML = "";

    const { data, error } = await supabaseClient.storage
        .from("Photo's")
        .list();

    if (error) {
        console.error(error);
        gallery.innerHTML = "<p>Unable to load photos.</p>";
        return;
    }

    if (!data || data.length === 0) {
        gallery.innerHTML = `
            <div class="photo">
                No photos yet
            </div>
        `;
        return;
    }

    data.forEach((file) => {

        const { data: publicUrlData } = supabaseClient.storage
            .from("Photo's")
            .getPublicUrl(file.name);

        const photo = document.createElement("div");
        photo.className = "photo";

        const image = document.createElement("img");

        image.src = publicUrlData.publicUrl;
        image.alt = "Gallery photo";

        image.style.width = "100%";
        image.style.height = "220px";
        image.style.objectFit = "cover";
        image.style.display = "block";

        photo.appendChild(image);
        gallery.appendChild(photo);
    });
}


// ===============================
// LOAD PHOTOS WHEN PAGE OPENS
// ===============================

loadPhotos();
