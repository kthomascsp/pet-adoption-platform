import { login, signup } from './actions'

export default function LoginPage() {
    return (
        <div className="flex items-center justify-evenly p-8">
            <div className="flex flex-col justify-center items-center">
                <h1 className="text-2xl m-4">Login</h1>
                <form action={login} className="flex flex-col gap-2 border p-5 rounded">
                    <input type="email" name="email" placeholder="Email" className="border p-3 rounded w-100 m-3" required/>
                    <input type="password" name="password" placeholder="Password" className="border p-3 rounded w-100 m-3" required/>
                    <button type="submit" className="bg-blue-500 p-3 rounded hover:bg-blue-600 w-100 m-4">
                        Log In
                    </button>
                </form>
            </div>

            <p className="text-2xl">or</p>

            <div className="flex flex-col justify-center items-center">
                <h1 className="text-2xl m-4">Sign Up</h1>
                <form action={signup} className="flex flex-col gap-2 border p-5 rounded">
                    <div className='flex justify-center item-center m-3'>
                        <h2 className="text-2xl">Select Account Type</h2>
                    </div>
                    <div className="flex space-x-6 justify-evenly m-2">
                        <label className="flex items-center space-x-2">
                            <input type="radio" name="accountType" value="shelter" className="h-5 w-5 text-blue-600 focus:ring-blue-500"/>
                            <span className="text-lg">Shelter</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="radio" name="accountType" value="adopter" className="h-5 w-5 text-blue-600 focus:ring-blue-500"/>
                            <span className="text-lg">Adopter</span>
                        </label>
                    </div>
                    <input type="firstname" name="firstname" placeholder="First Name" className="border p-3 rounded w-100 m-3" required/>
                    <input type="lastname" name="lastname" placeholder="Last Name" className="border p-3 rounded w-100 m-3" required/>
                    <input type="address" name="address" placeholder="Address" className="border p-3 rounded w-100 m-3" required/>
                    <input type="city" name="city" placeholder="City" className="border p-3 rounded w-100 m-3" required/>
                    <input type="state" name="state" placeholder="State" className="border p-3 rounded w-100 m-3" required/>
                    <input type="zip" name="zip" placeholder="Zip" className="border p-3 rounded w-100 m-3" required/>
                    <input type="phone" name="phone" placeholder="Phone" className="border p-3 rounded w-100 m-3" required/>
                    <input type="email" name="email" placeholder="Email" className="border p-3 rounded w-100 m-3" required/>
                    <input type="password" name="password" placeholder="Password" className="border p-3 rounded w-100 m-3" required/>
                    <button type="submit" className="bg-green-500 p-3 rounded hover:bg-green-600 w-100 m-4">
                        Sign Up
                    </button>
                </form>
            </div>
    </div>
    )
}