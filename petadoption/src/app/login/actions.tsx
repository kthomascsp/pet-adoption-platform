'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    const data = {
        accountType: formData.get('accountType') as string,
        firstname: formData.get('firstname') as string,
        lastname: formData.get('lastname') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        zip: formData.get('zip') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
    })

    if (signUpError) {
        console.error('Signup error:', signUpError.message)
        redirect('/error')
    }

    if (authData?.user) {
    const { error: profileError } = await supabase
        .from('profiles')
        .insert([
            {
            ProfileID: authData.user.id,
            ProfileType: data.accountType,
            ProfileName: data.firstname,
            LastName: data.lastname,
            Address: data.address,
            City: data.city,
            State: data.state,
            Zip: data.zip,
            Phone: data.phone,
            ProfileDescription: "Edit your personal description.",
            ImageID: ""
            },
      ])

    if (profileError) {
      console.error('Profile error:', profileError.message)
    }
  }

    revalidatePath('/', 'layout')
    redirect('/')
}