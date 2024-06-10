const User = require('../models/User');

exports.getLoginPage = (req, res) => {
    const { msgSuccess, msgError } = req.query; 
    res.render('login', { msgSuccess, msgError }); // EJS dosyasına mesajları gönder
};
exports.getRegisterPage = (req, res) => {
    res.render('register');
};

exports.postRegister = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = new User({ email, password: password });
        await user.save();
        res.redirect('/giris?msgSuccess=Kayıt başarılı!');
    } catch (error) {
        console.error('Kayıt sırasında bir hata oluştu:', error);
        res.status(500).send('Kayıt sırasında bir hata oluştu');
    }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).redirect('/giris?msgError=Kullanıcı bulunamadı');
        }
        req.session.userID = user._id;
        res.redirect('/?msgSuccess=Başarıyla giriş yaptınız');
    } catch (error) {
        console.error('Giriş sırasında bir hata oluştu:', error);
        res.status(500).send('Giriş sırasında bir hata oluştu');
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

exports.getUyePaneli =async (req, res) => {
    const userId = req.session.userID;

    try {
        const user = await User.findById(userId);
        res.render('favorites', { googleFavorites: user.googleFavorites ,userFavorites :user.userFavorites});
    } catch (error) {
        console.error('Favoriler alınırken bir hata oluştu:', error);
        res.status(500).send('Favoriler alınırken bir hata oluştu');
    }
};

exports.addFavorite = async (req, res) => {
    const userId = req.session.userID;
    const { bookId, title, authors, image } = req.body;

    try {
        const user = await User.findById(userId);
        user.googleFavorites.push({ bookId, title, authors, image });
        await user.save();
        res.redirect('/');
    } catch (error) {
        console.error('Favori eklenirken bir hata oluştu:', error);
        res.status(500).send('Favori eklenirken bir hata oluştu');
    }
};

exports.getFavorites = async (req, res) => {
    const userId = req.session.userID;

    try {
        const user = await User.findById(userId);
        res.render('favorites', { googleFavorites: user.googleFavorites });
    } catch (error) {
        console.error('Favoriler alınırken bir hata oluştu:', error);
        res.status(500).send('Favoriler alınırken bir hata oluştu');
    }
};
exports.addUserFavorite = async (req, res) => {
    const userId = req.session.userID;
    const { title, authors } = req.body;

    try {
        const user = await User.findById(userId);
        user.userFavorites.push({ title, authors: authors.split(',').map(author => author.trim()) });
        await user.save();
        res.redirect('/favoriler');
    } catch (error) {
        console.error('Favori eklenirken bir hata oluştu:', error);
        res.status(500).send('Favori eklenirken bir hata oluştu');
    }
};
exports.getFavorites = async (req, res) => {
    const userId = req.session.userID;

    try {
        const user = await User.findById(userId);
        res.render('favorites', { 
            googleFavorites: user.googleFavorites,
            userFavorites: user.userFavorites 
        });
    } catch (error) {
        console.error('Favoriler alınırken bir hata oluştu:', error);
        res.status(500).send('Favoriler alınırken bir hata oluştu');
    }
};
exports.deleteGoogleFavorite = async (req, res) => {
    const userId = req.session.userID;
    const { bookId } = req.body;
    
    try {
        const user = await User.findById(userId);
        user.googleFavorites = user.googleFavorites.filter(book => book.bookId !== bookId);
        await user.save();
        res.redirect('/favoriler');
    } catch (error) {
        console.error('Google favori kitabi silinirken bir hata oluştu:', error);
        res.status(500).send('Google favori kitabi silinirken bir hata oluştu');
    }
};
exports.deleteUserFavorite = async (req, res) => {
    const userId = req.session.userID;
    const { index } = req.body;
    
    try {
        const user = await User.findById(userId);
        user.userFavorites.splice(index, 1);
        await user.save();
        res.redirect('/favoriler');
    } catch (error) {
        console.error('Kullanıcı favori kitabi silinirken bir hata oluştu:', error);
        res.status(500).send('Kullanıcı favori kitabi silinirken bir hata oluştu');
    }
};
exports.updateUserFavorite = async (req, res) => {
    const userId = req.session.userID;
    const { index, title, authors } = req.body;

    try {
        const user = await User.findById(userId);
        user.userFavorites[index] = { title, authors: authors.split(',').map(author => author.trim()) };
        await user.save();
        res.redirect('/favoriler');
    } catch (error) {
        console.error('Kullanıcı favori kitabi güncellenirken bir hata oluştu:', error);
        res.status(500).send('Kullanıcı favori kitabi güncellenirken bir hata oluştu');
    }
};
exports.rateAndReview = async (req, res) => {
    const userId = req.session.userID;
    const { index, rating, review } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user || !user.userFavorites[index]) {
            return res.status(404).send('Favori kitap bulunamadı.');
        }

        const currentFavorite = user.userFavorites[index];

        currentFavorite.rating = parseInt(rating); // Yeni rating değeri, integer olarak saklayalım
        currentFavorite.review = review; // Yeni review değeri

        await user.save();
        res.redirect('/favoriler');
    } catch (error) {
        console.error('Kullanıcı favori kitabı puan ve yorum işlemi sırasında bir hata oluştu:', error);
        res.status(500).send('Kullanıcı favori kitabı puan ve yorum işlemi sırasında bir hata oluştu');
    }
};
exports.getProfilePage = async (req, res) => {
    const userId = req.session.userID;

    if (!userId) {
        return res.status(401).send('Oturum açmalısınız.');
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('Kullanıcı bulunamadı.');
        }

        res.render('profile', { email: user.email });
    } catch (error) {
        console.error('Profil alınırken bir hata oluştu:', error);
        res.status(500).send('Profil alınırken bir hata oluştu');
    }
};

exports.updateProfile = async (req, res) => {
    const userId = req.session.userID;
    const { email, password, confirmPassword } = req.body;

    if (!userId) {
        return res.status(401).send('Oturum açmalısınız.');
    }

    if (password !== confirmPassword) {
        return res.status(400).send('Şifreler eşleşmiyor.');
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('Kullanıcı bulunamadı.');
        }

        user.email = email;
        if (password) {
            user.password = password; // `pre-save` hook'u burada şifrelemeyi gerçekleştirecek
        }

        await user.save();
        res.redirect('/profile?msgSuccess=Bilgiler güncellendi.');
    } catch (error) {
        console.error('Profil güncellenirken bir hata oluştu:', error);
        res.status(500).send('Profil güncellenirken bir hata oluştu');
    }
};