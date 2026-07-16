# UNIFY Music Policy Audit

## Age model

| Feature group | Minimum age |
|---|---:|
| Core local player, EQ and private cloud/server playback | 13+ |
| Community accounts and every Community action | 16+ |

## Connected sources documented

- Google Drive read-only access
- Dropbox OAuth and selected folders
- WebDAV, HTTPS guidance and app passwords
- SMB2 / SMB3, NAS, share and workgroup/domain
- Metadata and album artwork indexes
- Progressive buffering, seek-aware recovery and offline cache
- Disconnect, remove-library and clear-cache differences
- Original cloud/server files are never deleted by local cache or library removal

## Implementation note

The app UI and backend rules must enforce the same 16+ Community restriction described in these legal pages. The policy alone is not an age gate.


## Premium and Community separation

Community must not be represented as a permanently guaranteed component of Monthly, Yearly or Lifetime Premium. Purchase screens should focus Premium value on eligible app/player functionality. Community is an additional developer-operated service, while Google Drive, Dropbox, WebDAV and SMB/NAS are separate connected-source features with their own provider and network dependencies.
