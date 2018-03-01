import { action, autorun } from 'mobx';
import { firebase, omitKeysWith } from '../helpers';
import { collection } from 'mobx-app';
import find from 'lodash/find';
import Fuse from 'fuse.js';
import isString from 'lodash/isString';
import map from 'lodash/map';

const actions = (state) => {

	const users = collection(state.users);

	const findById = (...args) => map(args, (id) => firebase.addFirebaseListener(`users/${id}`, onUserData));

	const findByEmail = (email) => firebase.getRef('users').where('email', '==', email).get();

	const onAuthStateChanged = (res) => {
		if (res === null) {
			setListening(true);
			return;
		}
		
		const { uid, email, emailVerified } = res;
		const user = { _uid: uid, _isCurrent: true, email, emailVerified, lastLogin: new Date() };
		
		users.updateOrAdd(user, '_uid', true);
		firebase.setDoc(`users/${uid}`, user);
		findById(uid);
		setListening(true);
	};
	
	const onUserData = action((doc) => doc.exists && users.updateOrAdd({ _uid: doc.id, ...doc.data() }, '_uid'));

	const signIn = async (email, password) => await firebase.auth.signInWithEmailAndPassword(email, password).catch((error) => error);

	const signOut = () => {
		const currentUser = find(state.users, ['_isCurrent', true]);
		users.updateItem({ _uid: currentUser._uid, _isCurrent: false }, '_uid');
		firebase.removeFirebaseListener();
		firebase.auth.signOut();
	};

	const resetPassword = async (email) => firebase.auth.sendPasswordResetEmail(email).then(() => ({})).catch((error) => error);

	const create = async (email, password, obj) => {
		const defaults = {
			avatar: '/assets/images/profile-avatar-placeholder.png',
			created: new Date()
		};
		const noPrivates = omitKeysWith(obj, '_');

		const newUser = await firebase.auth.createUserWithEmailAndPassword(email, password).catch((error) => error);
		if (newUser.code) return newUser;

		const path = `users/${newUser.uid}`;
		const avatar = isString(noPrivates.avatar)
			? noPrivates.avatar === ''
				? defaults.avatar
				: noPrivates.avatar
			: (await firebase.putFile(`${path}/avatar.png`, noPrivates.avatar)).downloadURL;

		return await firebase.setDoc(`${path}`, { ...defaults, ...noPrivates, avatar }).then(() => ({})).catch((error) => error);
	};
	
	const setListening = action((val) => state.listening = val);
	
	const startListening = () => firebase.auth.onAuthStateChanged(onAuthStateChanged);
	startListening();

	let searchable = new Fuse(state.users, { keys: ['name'] });
	const search = (query) => searchable.search(query);

	autorun(() => searchable = new Fuse(state.users, { keys: ['name'] }));

	return {
		...users,
		findByEmail,
		create,
		resetPassword,
		search,
		signIn,
		signOut
	};
};

export default actions;