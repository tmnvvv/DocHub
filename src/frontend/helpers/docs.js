import uri from '@front/helpers/uri';
import gitlab from '@front/helpers/gitlab';

export default {
	urlFromProfile(profile, baseURI) {
		let result = null;
		// Устаревший признак "transport"
		const transport = (profile.transport || 'default').toLowerCase();
		if (transport === 'gitlab') {
			result = gitlab.makeFileURI(profile.project_id, profile.template || profile.source, profile.branch, 'raw');
		} else if (transport === 'http') {
			result = profile.source;
		} else {
			const source = uri.makeURL(profile.template || profile.source, baseURI || (window.origin + '/'));
			result = source.url;
		}
		return result ? result.toString() : '';
	}
};