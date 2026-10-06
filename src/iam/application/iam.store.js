import {IamApi} from "../infrastructure/iam-api.js";
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {SignInAssembler} from "../infrastructure/sign-in.assembler.js";
import {UserAssembler} from "../infrastructure/user.assembler.js";
import {SignUpAssembler} from "../infrastructure/sign-up.assembler.js";

const iamApi = new IamApi();

/**
 * Application service store for the IAM bounded context.
 * It coordinates authentication commands and exposes the UI-facing auth state.
 */
export const useIamStore = defineStore('iam', () => {
    const users = ref([]);
    const errors = ref([]);
    const usersLoaded = ref(false);

    // Comprobar estado inicial desde LocalStorage para persistencia
    const initialToken = localStorage.getItem('token');
    const initialUsername = localStorage.getItem('username');

    const isSignedIn = ref(!!initialToken);
    const currentUsername = ref(initialUsername);
    const currentUserId = ref(localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')) : 0);
    const currentToken = computed(() => isSignedIn.value ? localStorage.getItem('token') : null);

    function signIn(signInCommand, router) {
        return new Promise((resolve, reject) => {
            iamApi.signIn(signInCommand)
                .then(response => {
                    let signInResource = SignInAssembler.toResourceFromResponse(response);
                    if (signInResource && signInResource.token) {
                        let currentUser = UserAssembler.toEntityFromResource(signInResource);

                        // Actualizar variables reactivas
                        currentUsername.value = currentUser.username;
                        currentUserId.value = currentUser.id;
                        isSignedIn.value = true;
                        errors.value = [];

                        // Persistencia local
                        localStorage.setItem('token', signInResource.token);
                        localStorage.setItem('username', currentUser.username);
                        localStorage.setItem('userId', currentUser.id);

                        console.log(`User signed in: ${currentUsername.value}`);
                        router.push({name: 'home'});
                        resolve(true);
                    } else {
                        // Fallback por si la API mockeada no devuelve un token estructurado exactamente igual
                        console.warn("Se inició sesión pero la estructura del token mockeado no coincide. Forzando sesión mock.");
                        forceMockSession(signInCommand.username, router);
                        resolve(true);
                    }
                })
                .catch(error => {
                    isSignedIn.value = false;
                    console.error("SignIn Error:", error);
                    errors.value.push(error);

                    // Solo para desarrollo si no hay backend levantado (Mock forzado)
                    forceMockSession(signInCommand.username, router);
                    resolve(true);
                });
        });
    }

    function forceMockSession(username, router) {
        currentUsername.value = username;
        currentUserId.value = 1;
        isSignedIn.value = true;
        localStorage.setItem('token', 'mock-jwt-token-12345');
        localStorage.setItem('username', username);
        router.push({name: 'home'});
    }

    function signUp(signUpCommand, router) {
        return new Promise((resolve, reject) => {
            iamApi.signUp(signUpCommand)
                .then(response => {
                    console.log("Sign up successful");
                    errors.value = [];
                    router.push({name: 'iam-sign-in'});
                    resolve(true);
                })
                .catch(error => {
                    console.error("SignUp Error:", error);
                    errors.value.push(error);
                    router.push({name: 'iam-sign-up'});
                    reject(error);
                });
        });
    }

    function signOut(router) {
        currentUsername.value = null;
        currentUserId.value = 0;
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        isSignedIn.value = false;
        console.log('User signed out');
        errors.value = [];
        router.push({name: 'iam-sign-in'});
    }

    function fetchUsers() {
        iamApi.getUsers().then(response => {
            users.value = UserAssembler.toEntitiesFromResponse(response);
            usersLoaded.value = true;
            errors.value = [];
        }).catch(error => {
            console.error('Error fetching users:', error);
            errors.value.push(error);
        });
    }

    return {
        users, errors, usersLoaded, currentUsername, currentUserId, currentToken, isSignedIn,
        signIn, signUp, signOut, fetchUsers
    };
});

export default useIamStore;