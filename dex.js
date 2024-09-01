import axios from "axios";

const dex = axios.create({
	baseURL: "https://api.getdex.com/api/rest",
	headers: {
		"Content-Type": "application/json",
		"x-hasura-dex-api-key": process.env.DEX_API_KEY,
		"Cache-Control": "no-cache",
	},
});

export async function getContacts(limit = 100, offset = 0) {
	try {
		const response = await dex.get(`/contacts`, {
			params: {
				limit,
				offset,
			},
		});
		return response.data.contacts;
	} catch (error) {
		console.error("Error fetching contacts:", error.message);
		throw error;
	}
}

export async function addNote(contactId, note, date) {
	try {
		const response = await dex.post(`/timeline_items`, {
			timeline_event: {
				note: note,
				event_time: date,
				meeting_type: "note",
				timeline_items_contacts: {
					data: [{ contact_id: contactId }],
				},
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error adding note:", error.message);
		throw error;
	}
}
export async function getNotes(contactId, limit = 100, offset = 0) {
	try {
		const response = await dex.get(
			`/timeline_items/contacts/` + contactId,
			{
				params: {
					limit,
					offset,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching notes:", error.message);
		throw error;
	}
}
