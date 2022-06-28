<script setup lang="ts">
import { ref } from 'vue'
import { userStore } from '../stores/user'
import { useRouter, useRoute } from 'vue-router';

const identifier = ref("")
const password = ref("")
const store = userStore()
const router = useRouter()
const route = useRoute()

const validated = ref(false)
const validationMessage = ref("")

async function authenticate(){
    validated.value = true
    if(identifier.value && password.value) {
        const result = await store.authenticate(identifier.value, password.value)
        if(result) {
            validationMessage.value = ""
            let redirect = "/"
            if(store.isAdmin) {
                redirect = route.query.redirect ? route.query.redirect as string: "/admin"
            }
            router.push(redirect)
        } else {
            validationMessage.value = "Usuário ou senha incorretos!"
        }
    }
}

</script>

<template>
    <div class="row justify-content-center">
        <div class="col-6 card" >
            <div class="card-body">
                <h5 class="card-title">Sign in</h5>
                <div class="alert alert-danger" v-if="validationMessage" role="alert">
                    {{validationMessage}}
                </div>
                <form :class="{ 'was-validated': validated}">
                    <div class="mb-3">
                        <label for="emailInput" class="form-label">Email:</label>
                        <input type="email" class="form-control" id="emailInput" placeholder="mail@mail.com" v-model="identifier" required>
                        <div class="invalid-feedback">
                            Você deve informar um email válido.
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="passwordInput" class="form-label">Password</label>
                        <input type="password" class="form-control" id="passwordInput" v-model="password" required>
                        <div class="invalid-feedback">
                            A senha é um campo obrigatório.
                        </div>
                    </div>
                </form>
                <div class="mb-3">
                    <a class="float-end btn btn-primary" @click="authenticate">Login</a>
                </div>
            </div>
        </div>
    </div>
    
</template>

