import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('========================================');
console.log('TEST DE CONFIGURATION EMAIL');
console.log('========================================\n');

console.log('Configuration Email :');
console.log('HOST:', process.env.EMAIL_HOST || '❌ NON CONFIGURÉ');
console.log('PORT:', process.env.EMAIL_PORT || '❌ NON CONFIGURÉ');
console.log('USER:', process.env.EMAIL_USER || '❌ NON CONFIGURÉ');
console.log('PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Configuré (***masqué***)' : '❌ NON CONFIGURÉ');
console.log('FROM:', process.env.EMAIL_FROM || '❌ NON CONFIGURÉ');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('\n❌ ERREUR : Les variables EMAIL_USER et EMAIL_PASSWORD doivent être configurées dans le fichier .env\n');
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const mailOptions = {
    from: process.env.EMAIL_FROM || `Centre de Formation <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Envoi à vous-même pour test
    subject: '✅ Test Email - Centre de Formation',
    html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .success { background: #10b981; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ Test Réussi !</h1>
                </div>
                <div class="content">
                    <div class="success">
                        <h2>🎉 Les emails fonctionnent correctement !</h2>
                    </div>
                    
                    <p>Si vous recevez cet email, cela signifie que :</p>
                    <ul>
                        <li>✅ Le fichier .env est correctement configuré</li>
                        <li>✅ Le mot de passe d'application Gmail est valide</li>
                        <li>✅ Nodemailer fonctionne correctement</li>
                        <li>✅ Le système d'emails est opérationnel</li>
                    </ul>
                    
                    <p><strong>Prochaines étapes :</strong></p>
                    <ol>
                        <li>Testez l'inscription d'un formateur externe</li>
                        <li>Vérifiez que vous recevez l'email de confirmation</li>
                        <li>Testez l'approbation et le rejet</li>
                    </ol>
                    
                    <p>Cordialement,<br><strong>Système de Test</strong></p>
                </div>
            </div>
        </body>
        </html>
    `
};

console.log('\n📧 Envoi de l\'email de test...\n');

transporter.sendMail(mailOptions)
    .then((info) => {
        console.log('========================================');
        console.log('✅ EMAIL ENVOYÉ AVEC SUCCÈS !');
        console.log('========================================\n');
        console.log('Message ID:', info.messageId);
        console.log('Destinataire:', process.env.EMAIL_USER);
        console.log('\n📬 Vérifiez votre boîte mail (et le dossier spam/courrier indésirable)\n');
        process.exit(0);
    })
    .catch((error) => {
        console.log('========================================');
        console.log('❌ ERREUR LORS DE L\'ENVOI');
        console.log('========================================\n');
        console.error('Message d\'erreur:', error.message);
        console.error('\n📋 Détails de l\'erreur:', error);

        console.log('\n🔧 SOLUTIONS POSSIBLES :\n');

        if (error.message.includes('Invalid login')) {
            console.log('❌ Problème : Mot de passe d\'application incorrect');
            console.log('✅ Solution :');
            console.log('   1. Allez sur https://myaccount.google.com/apppasswords');
            console.log('   2. Créez un nouveau mot de passe d\'application');
            console.log('   3. Copiez-le SANS les espaces');
            console.log('   4. Mettez-le dans EMAIL_PASSWORD dans le fichier .env');
            console.log('   5. Relancez ce test\n');
        } else if (error.message.includes('Missing credentials')) {
            console.log('❌ Problème : Variables d\'environnement manquantes');
            console.log('✅ Solution :');
            console.log('   1. Vérifiez que le fichier .env existe dans Backend/');
            console.log('   2. Vérifiez que EMAIL_USER et EMAIL_PASSWORD sont définis');
            console.log('   3. Relancez ce test\n');
        } else if (error.message.includes('ECONNECTION') || error.message.includes('timeout')) {
            console.log('❌ Problème : Impossible de se connecter au serveur SMTP');
            console.log('✅ Solution :');
            console.log('   1. Vérifiez votre connexion internet');
            console.log('   2. Vérifiez EMAIL_HOST=smtp.gmail.com');
            console.log('   3. Vérifiez EMAIL_PORT=587');
            console.log('   4. Relancez ce test\n');
        } else {
            console.log('❌ Erreur inconnue');
            console.log('✅ Consultez le fichier DIAGNOSTIC_EMAILS.md pour plus d\'aide\n');
        }

        process.exit(1);
    });
