import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuration du transporteur
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Email d'approbation
export const sendApprovalEmail = async (formateur, credentials = null) => {
    const subject = '✅ Votre candidature a été approuvée !';

    let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .credentials { background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; border-radius: 5px; }
                .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Félicitations !</h1>
                </div>
                <div class="content">
                    <p>Bonjour <strong>${formateur.prenom} ${formateur.nom}</strong>,</p>
                    
                    <p>Nous sommes ravis de vous informer que votre candidature en tant que formateur a été <strong>approuvée</strong> !</p>
                    
                    <p>Votre profil et vos compétences correspondent parfaitement à nos besoins. Nous sommes impatients de collaborer avec vous.</p>
    `;

    if (credentials) {
        htmlContent += `
                    <div class="credentials">
                        <h3>🔐 Vos identifiants de connexion</h3>
                        <p><strong>Email :</strong> ${formateur.email}</p>
                        <p><strong>Mot de passe :</strong> ${credentials.password}</p>
                        <p style="color: #ef4444; font-size: 14px;">⚠️ Veuillez changer votre mot de passe lors de votre première connexion.</p>
                    </div>
                    
                    <p>Vous pouvez maintenant vous connecter à la plateforme :</p>
                    <a href="http://localhost:5173/login" class="button">Se connecter</a>
        `;
    }

    htmlContent += `
                    <p style="margin-top: 30px;">Si vous avez des questions, n'hésitez pas à nous contacter.</p>
                    
                    <p>Cordialement,<br><strong>L'équipe du Centre de Formation</strong></p>
                </div>
                <div class="footer">
                    <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const mailOptions = {
        from: process.env.EMAIL_FROM || 'Centre de Formation <noreply@formation.com>',
        to: formateur.email,
        subject: subject,
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email d'approbation envoyé à ${formateur.email}`);
        return true;
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
        return false;
    }
};

// Email de rejet
export const sendRejectionEmail = async (formateur, raison = null) => {
    const subject = 'Réponse à votre candidature';

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Réponse à votre candidature</h1>
                </div>
                <div class="content">
                    <p>Bonjour <strong>${formateur.prenom} ${formateur.nom}</strong>,</p>
                    
                    <p>Nous vous remercions sincèrement pour l'intérêt que vous portez à notre centre de formation et pour le temps que vous avez consacré à votre candidature.</p>
                    
                    <p>Après un examen attentif de votre profil, nous sommes au regret de vous informer que nous ne pouvons pas donner suite à votre candidature pour le moment.</p>
                    
                    ${raison ? `<p><strong>Raison :</strong> ${raison}</p>` : ''}
                    
                    <p>Cette décision ne remet en aucun cas en question vos compétences professionnelles. Nous vous encourageons vivement à postuler de nouveau dans le futur si l'occasion se présente.</p>
                    
                    <p>Nous vous souhaitons beaucoup de succès dans vos projets professionnels.</p>
                    
                    <p>Cordialement,<br><strong>L'équipe du Centre de Formation</strong></p>
                </div>
                <div class="footer">
                    <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const mailOptions = {
        from: process.env.EMAIL_FROM || 'Centre de Formation <noreply@formation.com>',
        to: formateur.email,
        subject: subject,
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email de rejet envoyé à ${formateur.email}`);
        return true;
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
        return false;
    }
};

// Email de confirmation d'inscription
export const sendConfirmationEmail = async (formateur) => {
    const subject = '✉️ Confirmation de votre candidature';

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .info-box { background: white; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 5px; }
                .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📝 Candidature reçue !</h1>
                </div>
                <div class="content">
                    <p>Bonjour <strong>${formateur.prenom} ${formateur.nom}</strong>,</p>
                    
                    <p>Nous avons bien reçu votre candidature en tant que formateur. Merci pour votre intérêt !</p>
                    
                    <div class="info-box">
                        <h3>📋 Récapitulatif de votre candidature</h3>
                        <p><strong>Nom :</strong> ${formateur.nom}</p>
                        <p><strong>Prénom :</strong> ${formateur.prenom}</p>
                        <p><strong>Email :</strong> ${formateur.email}</p>
                        <p><strong>Compétences :</strong> ${formateur.mots_cles}</p>
                    </div>
                    
                    <p><strong>Prochaines étapes :</strong></p>
                    <ol>
                        <li>Notre équipe va examiner votre profil</li>
                        <li>Vous recevrez une réponse par email sous 48-72 heures</li>
                        <li>Si votre candidature est acceptée, vous recevrez vos identifiants de connexion</li>
                    </ol>
                    
                    <p>Nous vous remercions pour votre patience.</p>
                    
                    <p>Cordialement,<br><strong>L'équipe du Centre de Formation</strong></p>
                </div>
                <div class="footer">
                    <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const mailOptions = {
        from: process.env.EMAIL_FROM || 'Centre de Formation <noreply@formation.com>',
        to: formateur.email,
        subject: subject,
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email de confirmation envoyé à ${formateur.email}`);
        return true;
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
        return false;
    }
};

export default {
    sendApprovalEmail,
    sendRejectionEmail,
    sendConfirmationEmail
};
