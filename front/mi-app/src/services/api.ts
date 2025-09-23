import axios from "axios";
export const getExternalPhotos = async () =>
  axios.get("https://api.unsplash.com/photos/random?count=10&client_id=6Krsmg7kjS0O_6U7m9xZ1nOL2aI_n_6WpTZSdrVSWek");
