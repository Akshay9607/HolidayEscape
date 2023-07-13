const { Tour } = require('../models/Tour.model');

const addTour = async (req, res, next) => {
	const englishData = {};
	const arabicData = {};

	// English Data Mapping
	englishData.title = req.body.titleEn;
	englishData.destination = req.body.destinationEn;
	englishData.country = req.body.countryEn;
	englishData.city = req.body.cityEn;
	englishData.description = req.body.descriptionEn;
	// General
	englishData.price = req.body.price;
	englishData.duration = req.body.duration;
	englishData.imageBanner = req.body.imageBanner;
	englishData.tourImages = req.body.tourImages.split(',');
	englishData.offer = req.body.offer;
	englishData.booking = {
		facebookUrl: req.body.facebookUrl,
		phoneNumber: req.body.phoneNumber,
		twitterUrl: req.body.twitterUrl,
		mailId: req.body.mailId,
		instagramUrl: req.body.instagramUrl,
		discordUrl: req.body.discordUrl,
	};

	// Aarabic data Mapping
	arabicData.title = req.body.titleAr;
	arabicData.destination = req.body.destinationAr;
	arabicData.country = req.body.countryAr;
	arabicData.city = req.body.cityAr;
	arabicData.description = req.body.descriptionAr;
	// General
	arabicData.price = req.body.price;
	arabicData.duration = req.body.duration;
	arabicData.imageBanner = req.body.imageBanner;
	arabicData.tourImages = req.body.tourImages.split(',');
	arabicData.offer = req.body.offer;
	arabicData.booking = {
		facebookUrl: req.body.facebookUrl,
		phoneNumber: req.body.phoneNumber,
		twitterUrl: req.body.twitterUrl,
		mailId: req.body.mailId,
		instagramUrl: req.body.instagramUrl,
		discordUrl: req.body.discordUrl,
	};

	Tour.init().then(async () => {
		var new_tour = new Tour({
			englishData,
			arabicData,
		});
		try {
			const tour = await new_tour.save();
			// res.status(201).send(tour);
			res.redirect("/api/admin/get/all")
		} catch (err) {
			console.log(err.message);
			res.status(500).json({ error: err.message });
		}
	});
};

const getAllTours = async (req, res, next) => {
	try {
		let tours = await Tour.find();
		// res.status(200).json(tours);
		res.render('allTour', { tours: tours });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getAddSchedule = async (req, res, next) => {
	const tourID = req.params.tourID;
	try {
		const tour = await Tour.findById(tourID)
		const schedule = {enSchedule : tour.englishData.schedule, arSchedule : tour.arabicData.schedule}
		res.render('addSchedule', { tourID: tourID,  schedule});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const addSchedule = async (req, res, next) => {
	const tourID = req.params.tourID;
	const day = parseInt(req.body.day);
	const hour = parseInt(req.body.hour);
	const minute = parseInt(req.body.minute);
	// res.send({...req.body, id : tourID})
	// console.log(day, typeof day);
	try {
		let tours = await Tour.findById(tourID);
		const enSchedule = tours.englishData.schedule || [];
		const arSchedule = tours.arabicData.schedule || [];
		// console.log(enSchedule[day-1]);
		if (!enSchedule[day-1] ) {
			enSchedule[day - 1] = [
				{
					hour,
					minute,
					activityTitle: req.body.titleEn,
					activityDescription: req.body.descriptionEn,
				},
			];
			arSchedule[day - 1] = [
				{
					hour,
					minute,
					activityTitle: req.body.titleAr,
					activityDescription: req.body.descriptionAr,
				},
			];
		} else {
			enSchedule[day - 1] = [
				...enSchedule[day-1],
				{
					hour,
					minute,
					activityTitle: req.body.titleEn,
					activityDescription: req.body.descriptionEn,
				},
			];
			arSchedule[day - 1] = [
				...arSchedule[day-1],
				{
					hour,
					minute,
					activityTitle: req.body.titleAr,
					activityDescription: req.body.descriptionAr,
				},
			];
		}

		const updatedData = await Tour.findOneAndUpdate(
			{_id : tourID},
			{ $set : {"englishData.schedule":  enSchedule, "arabicData.schedule":  arSchedule } },
			{ new: true, runValidators: true}
		);
		// res.send(updatedData);
		res.redirect(`/api/admin/add/schedule/${tourID}`)
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

module.exports = {
	addTour,
	getAllTours,
	getAddSchedule,
	addSchedule,
};
