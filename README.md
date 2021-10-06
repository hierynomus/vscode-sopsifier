# SOPSifier

The SOPSifier extension can encrypt and decrypt `yaml` and `json` files using the `SOPS: Encrypt` and `SOPS: Decrypt` commands.

## Features

## Requirements

[SOPS](https://github.com/mozilla/sops) has been installed on your system and is available in the `$PATH`.

## Extension Settings

You can configure this extension using the following settings:

| Name | Description |
| `sops.keys.aws.kms` | The ARN of the AWS IAM KMS Role (if not specified this will be read from the `.sops.yaml` configfile, see the SOPS documentation) |
| `sops.keys.aws.profile` | The AWS profile to load (if not specified this will be read from the `.sops.yaml` configfile, see the SOPS documentation) |

## Release Notes

### 1.0.0

Initial release of SOPSifier
