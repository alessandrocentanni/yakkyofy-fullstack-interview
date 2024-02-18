<script setup lang="ts">
import axios from 'axios';
import {Ref, ref} from 'vue'; // Import ref from Vue for reactive variables

interface ScreenshotData {
  id: string;
  url: string;
  file: string;
  status?: string;
}

const url = ref(''); // Define reactive variable for URL
const screenshotIDs: Ref<string[]> = ref([]);// Define reactive variable for screenshot IDs
const screenshotData: Ref<ScreenshotData[]> = ref([]);// Define reactive variable for screenshot data

const makePostRequest = async () => {
  try {
    const res = await axios.post('http://localhost:3000/api/', { url: url.value });
    if (res.data.code === 200) {
      let id: string = res.data.data.id;

      if (id && !screenshotIDs.value.includes(id)) {
        screenshotIDs.value.push(id);
      }
    }
  } catch (error) {
    console.error('Error making POST request:', error);
  }
};

const getScreenshotData = async (id: string) => {
  try {
    const res = await axios.get('http://localhost:3000/api/' + id);
    if (res.data.code === 200) {
      screenshotIDs.value = res.data.data;
      let newData: ScreenshotData = {
        id: res.data.data.id,
        url: res.data.data.url,
        file: 'data:image/png;base64,' + res.data.data.file,
        status: res.data.data.status
      };
      return newData;
    }

  } catch (error) {
    console.error('Error making GET request:', error);
  }
};

const iterateScreenshotIDs = async () => {
  let updatedScreenshotIDs: string[] = [];
  for (let id of screenshotIDs.value) {
    let result = await getScreenshotData(id);
    if (result) {
      if (result.status === 'done') {
        if (!screenshotData.value.includes(result)){
          console.log('Adding new result to screenshotData:');
          screenshotData.value.push(result);
        }
        continue;
      }
      updatedScreenshotIDs.push(id);
    }
  }
  screenshotIDs.value = updatedScreenshotIDs;
  console.log('Updated screenshotIDs:', screenshotIDs.value);
  console.log('Updated screenshotData:', screenshotData.value);
};

onMounted(async () => {
  setInterval(iterateScreenshotIDs, 5000);
});


</script>

<template>
  <div>
    <h1>Screenshot Page</h1>
    <div>
      <label for="urlInput">Enter URL:</label>
      <input type="text" id="urlInput" v-model="url">
    </div>
    <div>
      <button @click="makePostRequest">Make POST Request</button>
    </div>
    <div v-if="screenshotData" :class="$style['wrapper-container']">
        <div v-for="(data, index) in screenshotData" :key="index" :class="$style['img-container']">
          <div v-if="data.status === 'done'">
            <img :src="data.file" alt="data.id">
          </div>
        </div>
      </div>
  </div>
</template>

<style module>
  .img-container {
    width: 250px;
    height: 250px;
    padding: 10px;
  }

  .wrapper-container{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

</style>