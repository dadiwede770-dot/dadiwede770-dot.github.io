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

    let mimeType = file.type;

    // Some browsers/devices may report certain image files
    // as application/octet-stream.
    if (!mimeType || mimeType === "application/octet-stream") {
        const extension = file.name.split(".").pop().toLowerCase();

        const mimeTypes = {
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            webp: "image/webp",
            gif: "image/gif",
            heic: "image/heic"
        };

        mimeType = mimeTypes[extension];
    }

    if (!mimeType || !mimeType.startsWith("image/")) {
        alert("Please choose a supported image file.");
        return;
    }

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabaseClient.storage
        .from("Photo's")
        .upload(fileName, file, {
            contentType: mimeType,
            upsert: false
        });

    if (error) {
        console.error("Upload error:", error);
        alert("Upload failed: " + error.message);
        return;
    }

    alert("Photo uploaded successfully! 📸");

    photoInput.value = "";

    loadPhotos();
});


// ===============================
// LOAD PHOTOS
// ===============================

async function loadPhotos() {

    gallery.innerHTML = "<p>Loading photos... 📸</p>";

    const { data: files, error } = await supabaseClient.storage
        .from("Photo's")
        .list("", {
            limit: 100,
            sortBy: {
                column: "created_at",
                order: "desc"
            }
        });

    if (error) {
        console.error("List error:", error);
        gallery.innerHTML = "<p>Unable to load photos.</p>";
        return;
    }

    const imageFiles = files.filter(file => {
        return file.name &&
            /\.(jpg|jpeg|png|webp|gif|heic)$/i.test(file.name);
    });

    if (imageFiles.length === 0) {
        gallery.innerHTML = `
            <div class="photo">
                No photos yet
            </div>
        `;
        return;
    }

    gallery.innerHTML = "";

    imageFiles.forEach(file => {

        const { data } = supabaseClient.storage
            .from("Photo's")
            .getPublicUrl(file.name);

        const photo = document.createElement("div");
        photo.className = "photo";

        const image = document.createElement("img");

        image.src = data.publicUrl;
        image.alt = file.name;
        image.loading = "lazy";

        image.style.width = "100%";
        image.style.height = "220px";
        image.style.objectFit = "cover";
        image.style.display = "block";

        image.onerror = () => {
            console.error("Could not display:", file.name);
        };

        photo.appendChild(image);
        gallery.appendChild(photo);
    });
}


// ===============================
// LOAD PHOTOS WHEN PAGE OPENS
// ===============================

loadPhotos();
