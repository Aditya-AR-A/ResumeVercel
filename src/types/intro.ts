export interface IntroConfig {
    profileImage: {
        /**
         * Image source path. Can be either:
         * - A full URL (e.g., 'https://example.com/image.jpg')
         * - A local path relative to public directory (e.g., 'images/profile.jpg')
         */
        src: string;
        alt: string;
    };
    name: string;
    title: string;
    about: string;
    socialLinks: {
        email: string;
        github: string;
        linkedin: string;
    };
    styles: {
        section: {
            marginBottom: number;
            padding: string;
            background: string;
            borderRadius: number;
            boxShadow: string;
        };
        profileImage: {
            width: number;
            height: number;
            borderRadius: string;
            border: string;
            boxShadow: string;
            marginBottom: number;
        };
        name: {
            fontSize: string;
            color: string;
        };
        title: {
            fontSize: string;
            color: string;
            margin: string;
            fontWeight: number;
        };
        about: {
            color: string;
            margin: string;
            maxWidth: number;
            fontSize: string;
            lineHeight: number;
        };
        socialLinks: {
            gap: number;
            marginTop: number;
            iconSize: number;
            iconColor: string;
        };
    };
}
