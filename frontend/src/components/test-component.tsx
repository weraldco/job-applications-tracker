import { LoginFormInputs, loginSchema } from '@/schemas/test.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

export default function LoginForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormInputs>({
		// Pass the zodResolver and your schema here
		resolver: zodResolver(loginSchema),
		// Optional: Set default values for controlled components
		defaultValues: {
			email: '',
			username: '',
			password: '',
		},
	});

	const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
		// This function only runs if the form data passes the Zod validation
		console.log(data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{/* Email Field */}
			<input
				type="email"
				placeholder="Email"
				{...register('email')} // Register the input with its schema name
			/>
			{/* Display the Zod error message */}
			{errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}

			<input type="text" {...register('username')} />
			{/* Password Field */}
			<input type="password" placeholder="Password" {...register('password')} />
			{errors.password && (
				<p style={{ color: 'red' }}>{errors.password.message}</p>
			)}

			<button type="submit">Log In</button>
		</form>
	);
}
