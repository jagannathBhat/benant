import 'typeface-roboto'
import axios from 'axios'
import React, { useState } from 'react'
import {
	CircularProgress,
	createMuiTheme,
	Button,
	makeStyles,
	Paper,
	ThemeProvider,
	Typography,
} from '@material-ui/core'
import { amber, green } from '@material-ui/core/colors'
import { PhotoCamera } from '@material-ui/icons'

import './App.css'

const useStyles = makeStyles(theme => ({
	buttonContainer: {
		margin: theme.spacing(6) + 'px 0px',
	},
	buttonProgress: {
		color: green[500],
		position: 'absolute',
		left: '50%',
		marginTop: 9,
		marginLeft: -12,
	},
	input: {
		display: 'none',
	},
	main: {
		display: 'flex',
		flexGrow: 90,
		flexDirection: 'column',
		justifyContent: 'center',
	},
	root: {
		borderRadius: '0px',
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		padding: theme.spacing(2),
	},
	top: {
		display: 'flex',
		flexGrow: 10,
		justifyContent: 'flex-end',
		paddingRight: theme.spacing(1),
	},
}))

function App() {
	const [themeSelect, setThemeSelect] = useState(
		localStorage.getItem('darkmode') === 'true' ? true : false
	)

	const classes = useStyles()

	const toggleDarkMode = () => {
		setThemeSelect(!themeSelect)
		localStorage.setItem('darkmode', !themeSelect)
	}

	const submitFile = async ({ target }) => {
		setLoading(true)
		try {
			let formData = new FormData()
			formData.append('file', target.files[0])
			const res = await axios.post('predict', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			setMessage(`Image shows ${(res.data * 100).toFixed(2)}% chance of cancer`)
		} catch (err) {
			console.error(err)
		}
		setLoading(false)
	}

	const theme = React.useMemo(
		() =>
			createMuiTheme({
				palette: {
					type: themeSelect ? 'dark' : 'light',
					primary: {
						main: amber[300],
					},
				},
			}),
		[themeSelect]
	)

	const [loading, setLoading] = useState(false)

	const [message, setMessage] = useState('Skin Cancer Detector')

	return (
		<ThemeProvider theme={theme}>
			<Paper className={classes.root}>
				<div className={classes.top}>
					<Button onClick={toggleDarkMode}>
						{themeSelect ? 'Light Mode' : 'Dark Mode'}
					</Button>
				</div>
				<div className={classes.main}>
					<Typography variant='h3' component='h1'>
						{message}
					</Typography>
					<form id='form'>
						<div className={classes.buttonContainer}>
							<input
								accept='image/*'
								className={classes.input}
								id='fileInput'
								onChange={submitFile}
								type='file'
								color='primary'
							/>
							<label htmlFor='fileInput'>
								<Button
									color='primary'
									component='span'
									disabled={loading}
									endIcon={<PhotoCamera />}
									size='large'
									variant='contained'
								>
									Upload Image
								</Button>
								{loading && (
									<CircularProgress
										size={24}
										className={classes.buttonProgress}
									/>
								)}
							</label>
						</div>
					</form>
					<Typography variant='body1' component='p'>
						Upload a photo of the tumor you would like to get checked and the
						app will display how likely it is skin cancer.
						<br />
						<b>
							It is advised to consult a doctor if the result is above 50%.
							<br />
							The results shown in this app are only 85% accurate. Any uploaded
							photos will be deleted from the server, once analysis is complete.
						</b>
					</Typography>
				</div>
			</Paper>
		</ThemeProvider>
	)
}

export default App
