import { fetch } from "node-fetch";
import { faker } from "@faker-js/faker/locale/id_ID";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { generateRandomIndonesianFullName } from "./randomName";

// Function to scrape the detailed data of a student
async function scrapeStudentDetails(studentId: string) {
  const detailUrl = `https://api-frontend.kemdikbud.go.id/detail_mhs/${studentId}`;
  try {
    const response = await fetch(detailUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch student details: ${response.status} ${response.statusText}`
      );
    }
    const studentData = await response.json();

    // Extract the necessary data
    const { dataumum } = studentData;
    const { nm_pd, namapt, namajenjang, mulai_smt } = dataumum; // Extract mulai_smt

    // Create the directory structure including the start semester
    const folderPath = join(
      __dirname,
      "datascrape",
      namapt,
      namajenjang,
      mulai_smt
    ); // Include mulai_smt in the path
    await mkdir(folderPath, { recursive: true });

    // Define the file path
    const filePath = join(folderPath, `${nm_pd}.json`);

    // Save the data to a JSON file
    await writeFile(filePath, JSON.stringify(studentData, null, 2));

    console.log(`Data for ${nm_pd} has been saved to ${filePath}`);
  } catch (error) {
    console.error("Error scraping student details:", error);
  }
}
// Function to scrape the initial data and process each student
async function scrapeInitialData(search: string) {
  const searchUrl = `https://api-frontend.kemdikbud.go.id/hit_mhs/${encodeURIComponent(
    search
  )}`;
  try {
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch initial data: ${response.status} ${response.statusText}`
      );
    }
    const searchData = await response.json();

    // Process each student
    for (const mahasiswa of searchData.mahasiswa) {
      const studentId = mahasiswa["website-link"].split("/").pop();
      await scrapeStudentDetails(studentId);
    }
  } catch (error) {
    console.error("Error scraping initial data:", error);
  }
}

// Replace 'searchTerm' with the actual search term you want to use
// const searchTerm =
//   "satria ardianto malang";
// scrapeInitialData(searchTerm);

// // const mName = faker.persopersonNaull); // Generates a random full name
// const randomName = faker.person.fullName();
// const universityName = "Universitas Muhammadiyah Malang";
// const searchTerm = `${randomName} ${universityName}`;
// scrapeInitialData(searchTerm);

// // Function to start a new search with a random name
// function startNewSearch() {
//     const randomName = faker.person.fullName();
//     const universityName = "Universitas Muhammadiyah Malang";
//     const searchTerm = `${randomName} ${universityName}`;
//     console.log(`Starting new search with term: ${searchTerm}`);
//     scrapeInitialData(searchTerm);
// }

// // Start the first search
// startNewSearch();

// 3333333333333333333
// Function to start a new search with a random name
async function startNewSearch(repeatCount: number) {
  if (repeatCount <= 0) {
    console.log("Scraping process completed.");
    return; // Exit if the repeat count reaches zero
  }

  const randomName = faker.person.fullName();
  const universityName = " Malang";
  const searchTerm = `${randomName} ${universityName}`;
  console.log(`Starting new search with term: ${searchTerm}`);

  await scrapeInitialData(searchTerm);

  console.log(`Searches remaining: ${repeatCount - 1}`);
  startNewSearch(repeatCount - 1); // Call the function again with the decreased count
}

// Start the first search with a specified repeat count
const repeatCount = 1000; // Replace with the number of times you want to repeat the scraping
startNewSearch(repeatCount);

//3333333333333333333333333333
// // const randomName = faker.person.fullName();
// const randomName = faker.person.firstName();
// console.log(randomName);

// INDONESIA
// console.log(randomFullName); // Output: Nama lengkap acak Indonesia

// Function to start a new search with a random name
// async function startNewSearch(repeatCount: number) {
//     if (repeatCount <= 0) {
//         console.log("Scraping process completed.");
//         return; // Exit if the repeat count reaches zero
//     }

//     const randomName = generateRandomIndonesianFullName();
//     // const randomName = faker.person.fullName();
//     const universityName = "Universitas Negeri Malang";
//     const searchTerm = `${randomName} ${universityName}`;
//     console.log(`Starting new search with term: ${searchTerm}`);

//     await scrapeInitialData(searchTerm);

//     console.log(`Searches remaining: ${repeatCount - 1}`);
//     startNewSearch(repeatCount - 1); // Call the function again with the decreased count
// }

// // Start the first search with a specified repeat count
// const repeatCount = 50; // Replace with the number of times you want to repeat the scraping
// startNewSearch(repeatCount);
