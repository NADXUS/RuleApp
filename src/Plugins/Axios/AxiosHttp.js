import axios from "axios";
import enviroments from "./../Enviromets";

const api = axios.create({
	baseURL: enviroments.BACKEND_URL,
	withCredentials: true,
});

const Axiosheaders = [{ "Content-Type": "application/json" }];
/* const apiURL = "https://api.rule34.xxx/index.php?";
const apiURL2 = "https://rule34.xxx"; */
const apiURL2 = "https://rule34.xxx";

module.exports = {
	getImagesGalery(tags, page, limit) {
		if (tags !== "++") {
			return api.get(
				`https://api.r34.app/booru/rule34.xxx/posts?baseEndpoint=rule34.xxx&limit=${limit}&tags=${tags}&pageID=${page}`,
				{
					headers: Axiosheaders[0],
				}
			);
		} else {
			return api.get(
				`https://api.r34.app/booru/rule34.xxx/posts?baseEndpoint=rule34.xxx&limit=${limit}&pageID=${page}`,
				{
					headers: Axiosheaders[0],
				}
			);
		}
	},
	getTagsSearch(works) {
		return api.get(`${apiURL2}/public/autocomplete.php?q=${works}`, {
			headers: Axiosheaders[0],
		});
	},
};
