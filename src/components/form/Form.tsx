import React, { useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { AsyncTypeahead, Typeahead } from 'react-bootstrap-typeahead';
import { Formik } from 'formik';

import { UserContext } from '../../contexts/User.context';

import InputField from '../input-field/InputField';
import Button from '../button/Button';
import styles from './Form.module.scss';

import { useProgrammes } from '../../hooks/useKthProgrammes';
import { useCourses } from '../../hooks/useKthCourses';
import { NetworkService, RequestStatus } from '../../api';
import { KthCourse } from '../../models/KthCourse';
import { BookUpload } from '../../models/BookUpload';
import { SearchContext } from '../../contexts';

interface Props extends RouteComponentProps {
	add?: boolean;
	book?: BookUpload;
}

const Form = (props: Props) => {
	const { add, book, history } = props;
	const { user } = useContext(UserContext);
	const { search } = useContext(SearchContext);
	const [programmes, programmeStatus] = useProgrammes();
	const [courses, courseStatus, setCourseQuery] = useCourses();

	return (
		<Formik
			initialValues={book ? book : new BookUpload()}
			onSubmit={(values, { setSubmitting }) => {
				setSubmitting(true);
				if (add) {
					NetworkService.addNewBook(user.rundbokToken, values)
						.finally(() => setSubmitting(false))
						.then(response => console.log(response))
						.catch(error => console.log(error));
				} else {
					NetworkService.editBook(user.rundbokToken, values, book.id)
						.finally(() => setSubmitting(false))
						.then(response => {
							history.replace('/my-books');
						})
						.catch(error => console.log(error));
				}
			}}
		>
			{({
				initialValues,
				values,
				handleChange,
				handleSubmit,
				isSubmitting,
				setFieldValue,
			}) => {
				const {
					author,
					programme_code,
					course_code,
					price,
					new_price,
					personal_description,
					description,
					release_year,
					title,
				} = initialValues;
				return (
					<form className={styles.form} onSubmit={handleSubmit}>
						<div className="row special-gutters">
							<div className="col-xl-8">
								<div className="row medium-gutters">
									<div className="col-md-6">
										<div className="d-flex flex-column">
											<label htmlFor="programme" className="input-label">
												Programme
											</label>
											<Typeahead
												id="programme"
												isLoading={programmeStatus === RequestStatus.LOADING}
												inputProps={{ name: 'programme', required: true }}
												labelKey="title"
												options={programmes}
												onChange={selected =>
													setFieldValue(
														'programme_code',
														selected[0].programmeCode
													)
												}
												placeholder="Search programme..."
											/>
										</div>
									</div>

									<div className="col-md-6">
										<div className="spacing d-xl-none" />
										<div className="d-flex flex-column">
											<label htmlFor="course" className="input-label">
												Course
											</label>
											<AsyncTypeahead
												id="course"
												isLoading={courseStatus === RequestStatus.LOADING}
												inputProps={{ name: 'course', required: true }}
												options={courses}
												labelKey="title"
												minLength={3}
												onSearch={setCourseQuery}
												onChange={selected =>
													setFieldValue('course_code', selected[0].courseCode)
												}
												placeholder="Search course..."
												renderMenuItemChildren={(
													option: KthCourse,
													_,
													index
												) => <div key={index}>{option.title}</div>}
											/>
										</div>
									</div>
								</div>

								<div className="spacing" />

								<div className="row medium-gutters">
									<div className="col-md-6">
										<InputField
											label="Title"
											name="title"
											type="text"
											defaultValue={title}
											onChange={handleChange}
										/>
									</div>

									<div className="col-md-6">
										<div className="spacing d-xl-none" />
										<InputField
											label="Author"
											name="author"
											type="text"
											defaultValue={author}
											onChange={handleChange}
										/>
									</div>
								</div>

								<div className="spacing" />

								<div className="row medium-gutters">
									<div className="col-md-6">
										<InputField
											label="Price"
											name="price"
											type="number"
											defaultValue={price && price.toString()}
											onChange={handleChange}
										/>
									</div>

									<div className="col-md-6">
										<div className="spacing d-xl-none" />
										<InputField
											label="New price"
											name="new_price"
											type="number"
											defaultValue={new_price && new_price.toString()}
											onChange={handleChange}
										/>
									</div>
								</div>

								<div className="spacing" />

								<div className="row medium-gutters">
									<div className="col-md-6">
										<InputField
											label="Release Year"
											name="release_year"
											type="number"
											defaultValue={release_year && release_year.toString()}
											onChange={handleChange}
										/>
									</div>
								</div>

								<div className="spacing" />

								<InputField
									label="Book description"
									name="description"
									type="textarea"
									defaultValue={description}
									onChange={handleChange}
								/>
							</div>
							<div className="col-xl-4">
								<div className="spacing d-xl-none" />

								<InputField
									label="Cover picture"
									name="cover_photo"
									type="file"
									text={values.cover_photo && values.cover_photo.name}
									onChange={event => {
										console.log(event.currentTarget.files[0]);
										setFieldValue('cover_photo', event.currentTarget.files[0]);
									}}
								/>

								<div className="spacing" />

								<InputField
									label="Book condition"
									name="personal_description"
									type="textarea"
									defaultValue={personal_description}
									onChange={handleChange}
								/>

								<div className="spacing" />

								<Button
									text={add ? 'Add book' : 'Edit book'}
									icon={add ? 'plus' : 'edit'}
									type="submit"
									disabled={isSubmitting}
								/>
								<div className="spacing" />
							</div>
						</div>
					</form>
				);
			}}
		</Formik>
	);
};

export default withRouter(Form);
