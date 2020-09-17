#import <UIKit/UIKit.h>

@class Artwork;
@class ARFollowArtistFeedItem;
@class Fair;
@class Gene;
@class PartnerShow;

// View Controller Forward Declarations

@class ARAuctionArtworkResultsViewController;
@class ARUserSettingsViewController;

/**
 The Switchboard is the internal API for loading different native views
  it does this mostly by using either an internal Sinatra like-router.
*/

NS_ASSUME_NONNULL_BEGIN


@interface ARSwitchBoard : NSObject

/// A shared instance object
+ (instancetype)sharedInstance;

///  Allow teardown for logout
+ (void)teardownSharedInstance;

/// Load a path relative to the baseURL through the router
- (UIViewController *)loadPath:(NSString *)path;

///  Load a path relative to the baseURL with an optional fair object
- (UIViewController *)loadPath:(NSString *)path fair:(Fair *_Nullable)fair;

/// Send an URL through the router
- (UIViewController *_Nullable)loadURL:(NSURL *)url;

/// Send an URL through the router with an optional fair object
- (UIViewController *_Nullable)loadURL:(NSURL *)url fair:(Fair *_Nullable)fair;

/// Converts a path into a full URL based on staging/prod
- (NSURL *)resolveRelativeUrl:(NSString *)path;

/// Shows an alert asking the user if they want to open in Safari, or some other app
- (void)openURLInExternalService:(NSURL *)url;

@end

NS_ASSUME_NONNULL_END
