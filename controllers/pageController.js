exports.getIndexPage = async (req, res) => {

    return res.render('index', {
        title: 'Kütüphane Otomasyonu',
        description: 'Kütüphane Otomasyonu',

    });
}

exports.get404Page = async (req, res) => {
    return res.render('404', {
        title: 'Sayfa Bulunamadı',
        description: 'Aradığınız sayfa bulunamadı.'
    });
}

